<template>
  <b-container>
    halo
    <b-row class="justify-content-center">
      <b-col cols="12" lg="8">
        <b-input-group
          size="sm"
          prepend="family name"
          class="mt-2 mb-0"
        >
          <b-form-input
            v-model="newFamilyName"
            :state="stateFamilyName"
          />
          <template #append>
            <b-button
              :disabled="!(stateFamilyName && familySize) "
              :class="{'btn-info':(stateFamilyName && familySize)}"
              @click="addNewFamily(newFamilyName, newTarget)"
            >
              add new family
            </b-button>
          </template>
        </b-input-group>
        <div class="small text-muted mb-2">
          <span>You have to give unique family name. </span>
          <span>Family name should be longer than 4 letters</span>
        </div>
        <hr>
        <dri-select
          :dri-items="dri"
          :target="newTarget"
          :max="100"
          class="multi"
          @update:target="updateNewFamily"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import driSelect from "~/components/molecules/driSelect";

export default {
  name: "MyTest01",
  components:{
    driSelect
  },
  data(){
    return {
      newFamilyName: '',
      newTarget: [],
    }
  },
  computed:{
    stateFamilyName: {
      get(){
        // return this.newFamilyName.length > 4 && !this.familyList.includes(this.newFamilyName)
        return this.newFamilyName.length > 4
      }
    },
    familySize () {
      return this.newTarget.reduce((accum, curr) => {
        accum += curr.count
        return accum
      }, 0)
    },
  }
};
</script>

<style scoped>

</style>
