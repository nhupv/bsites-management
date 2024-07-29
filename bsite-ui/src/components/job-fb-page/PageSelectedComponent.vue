<script lang="ts" setup>
import {computed, onMounted, ref, watch} from "vue";
import {format} from "date-fns";
import SelectPageDialog from "@/components/fb-page/SelectPageDialog.vue";
import {pageHeaderSelect, pageHeaderSelected} from "@/components/fb-page/utils";
import {httpService} from "@/app/http/httpServiceProvider";
import {handleError} from "@/app/helpers";
const emit = defineEmits([ "update:modelValue","onChange"]);

const pageList = ref([])
const pageIdSelected = defineModel<Array<any>>('pageIdSelected')
const pageSelected = ref([] as Array<any>)

const selectPageDialog = ref(false)

const getPageList = async () => {
  try {
    const data = await httpService.post('/fb-page/all', {})
    pageList.value = data
  } catch (e) {
    handleError(e)
  }
}

watch(pageSelected, (value)=> {
  emit("onChange", value)
})

watch(pageIdSelected, (value: any) => {
  pageSelected.value = []
  value.forEach((item: any) => {
    const pageInList: any = pageList.value.find((page: any) => page._id === item)
    if(pageInList) {
      pageSelected.value = [{ ...pageInList }, ...pageSelected.value]
    }
  })

})

const deletePageSelected = (page: any) => {
  pageSelected.value = pageSelected.value.filter((item: any) => page._id !== item._id)
  pageIdSelected.value = pageSelected.value.map((item: any) => item._id)
}

onMounted(()=> {
  getPageList()
})

</script>
<template>
  <v-row>
    <v-col cols="12">
      <div class="d-flex align-center justify-space-between">
        <h6>Page</h6>
        <v-btn  size="x-small" variant="outlined" color="primary" @click="selectPageDialog = true">
          <v-icon>mdi-playlist-plus</v-icon>
        </v-btn>
      </div>
    </v-col>
    <v-col cols="12">
      <v-data-table-virtual
          density="compact"
          sticky
          :headers="pageHeaderSelected"
          :items="pageSelected"
          height="350"
          item-value="_id"
      >
        <template v-slot:item.stt="{index} : any">
          {{index + 1}}
        </template>
        <template v-slot:item.page_name="{item} : any">
          <span class="text-primary">{{item.page_name}}</span>
        </template>
        <template v-slot:item.scheduled_time="{item, index} : any">
          <VueDatePicker
              v-model="pageSelected[index].scheduled_time"
              :min-date="new Date()"
              :teleport="true"
              :clearable="false"
              auto-apply
              time-picker-inline
              :format="(date: Date) => date && format(date, 'LLLL dd, yyyy HH:mm')"
              :enable-time-picker="true"
          />
        </template>
        <template v-slot:item.action="{item}">
          <v-btn
              density="compact"
              variant="text"
              icon
              text=""
              size="small"
              @click="deletePageSelected(item)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table-virtual>
    </v-col>
  </v-row>
  <SelectPageDialog v-model="selectPageDialog" v-model:pageIdSelected="pageIdSelected" />
</template>
