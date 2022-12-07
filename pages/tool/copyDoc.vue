<template>
  <b-container>
    from: {{ sourceDocName }}
    <b-select v-model="sourceCollectionId" :options="['dataset', 'user']" />
    <b-select
      v-model="sourceDocName"
      :options="dbList"
      @change="onSourceSelected"
    />
    <b-card>
      <json-view :value="sourceDoc" />
    </b-card>
    <hr />
    to:
    <b-select
      v-model="destCollectionId"
      :options="['nfaSharedData', 'nfaUserData']"
    />
    <b-form-input v-model="destDocName" />
    <b-button
      v-if="Object.values(sourceDoc).length > 0"
      @click="uploadDoc(destCollectionId, destDocName, myDocArray, mySchema)"
      >copy</b-button
    >
  </b-container>
</template>

<script>
// import firebase from "firebase/compat";

import { initializeApp } from 'firebase/app'
import {
  CACHE_SIZE_UNLIMITED,
  collection,
  doc,
  getDoc,
  getDocs,
  initializeFirestore,
  setDoc,
} from 'firebase/firestore'
import JsonView from 'vue-json-viewer'
import { driSchema, fctSchema, setTypeOfDeepObject } from '../../plugins/helper'
import { firestoreDb } from '@/plugins/firebasePlugin'
import { makeToast } from '@/plugins/helper'

export default {
  name: 'MyTest01',
  components: {
    JsonView,
  },
  data() {
    return {
      /**
       * The following fields are REQUIRED:
       * - Project ID
       * - App ID
       * - API Key
       */
      secondaryAppConfig: {
        projectId: 'ifnaapp01',
        appId: '1:419104702670:web:94dc61759415cd134a909f',
        apiKey: 'AIzaSyDH_RkqtAD6I-MQIcSVFVWDeeGzZUPI2pw',
        // databaseURL: "...",
        // storageBucket: "...",
      },

      secondaryApp: null,
      secondaryFirestore: null,
      dbList: [],
      destCollectionId: '',
      destDocName: '',
      sourceCollectionId: '',
      sourceDocName: '',
      sourceDoc: {},
    }
  },
  computed: {
    docList: {
      get() {
        return this.dbList.map((item) => {
          return item
        })
      },
    },
    /**
     * csv等から読み込んだ生データを型付きObjectに代入
     */
    myDocArray: {
      get() {
        return Object.values(this.sourceDoc).map((item) => {
          if (this.sourceDocName.includes('fct')) {
            return {
              Group: item.food_group_unicef2,
              Name: item.Food_name,
              food_grp_id: item.food_grp_id,
              id: item.food_item_id,
              En: item.Energy,
              Pr: item.Protein,
              Fe: item.FE,
              Va: item.VITA_RAE,
              Carbohydrate: item.Carbohydrate,
              Fat: item.Fat,
            }
          } else if (this.sourceDocName.includes('dri')) {
            return {
              Name: item.nut_group,
              id: item.id,
              En: item.energy,
              Pr: item.protein,
              Fe: item.fe,
              Va: item.vita,
              max_vol: item.max_vol,
            }
          } else {
            return {}
          }
        })
      },
    },
    mySchema: {
      get() {
        if (this.sourceDocName.includes('fct')) {
          return fctSchema
        } else if (this.sourceDocName.includes('dri')) {
          return driSchema
        } else {
          return {}
        }
      },
    },
  },
  async created() {
    this.secondaryApp = initializeApp(this.secondaryAppConfig, 'secondary')
    /**
     * キャッシュサイズを最大化
     * @type {Firestore}
     */
    this.secondaryFirestore = initializeFirestore(this.secondaryApp, {
      cacheSizeBytes: CACHE_SIZE_UNLIMITED,
    })
    await this.$store.dispatch('fire/updateLoadingState', true)
    await this.$store.dispatch('fire/updateLoadingState', true)
    this.dbList = await this.getDocList('dataset')
    await this.$store.dispatch('fire/updateLoadingState', false)
    await this.$store.dispatch('fire/updateLoadingState', false)
  },
  methods: {
    async onSourceSelected(val) {
      console.log(val)
      this.destDocName = val
      await this.$store.dispatch('fire/updateLoadingState', true)
      const ref = await doc(this.secondaryFirestore, 'dataset', val)
      const docSnap = await getDoc(ref).catch((err) => {
        console.error(err)
      })
      if (docSnap.exists()) {
        this.sourceDoc = docSnap.data()
      } else {
        console.log('getData fail: no data in Cache or Server')
      }
      await this.$store.dispatch('fire/updateLoadingState', false)
    },
    async getDocList(myCollection, returnValue = 1) {
      const res = []
      await this.$store.dispatch('fire/updateLoadingState', true)
      const querySnapshot = await getDocs(
        collection(this.secondaryFirestore, myCollection)
      )
      await this.$store.dispatch('fire/updateLoadingState', false)
      querySnapshot.forEach((item) => {
        if (returnValue === 2) {
          res.push({
            id: item.id,
            name: item.data().user.displayName,
          })
        } else {
          res.push(item.id)
        }
      })
      return res
    },
    async uploadDoc(collectionId, docId, myDoc, mySchema) {
      // loadingをセット
      await this.$store.dispatch('fire/updateLoadingState', true)

      // 生データに型を付与
      const myDocWithType = setTypeOfDeepObject(myDoc, mySchema).reduce(
        (accum, current) => {
          accum[current.id] = current
          return accum
        },
        {}
      )

      // 型付きデータをfirebaseにアップロード
      await setDoc(doc(firestoreDb, collectionId, docId), myDocWithType).catch(
        (err) => {
          throw err
        }
      )

      // データ更新フラグをおろす（必要か？）
      await this.$store.dispatch('fire/updateLoadingState', false)
      makeToast(this, 'copy done!')
    },
  },
}
</script>
