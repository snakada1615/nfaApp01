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
      @click="uploadDoc(destCollectionId, destDocName, sourceDoc)"
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
    async uploadDoc(collectionId, docId, myDoc) {
      await this.$store.dispatch('fire/updateLoadingState', true)
      await setDoc(doc(firestoreDb, collectionId, docId), myDoc).catch(
        (err) => {
          throw err
        }
      )
      await this.$store.dispatch('fire/updateLoadingState', false)
      makeToast(this, 'copy done!')
    },
  },
}
</script>
