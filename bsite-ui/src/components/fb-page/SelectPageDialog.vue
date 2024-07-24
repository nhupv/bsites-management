<script lang="ts" setup>
import {computed, onMounted, ref, watch} from "vue";
import {httpService} from "@/app/http/httpServiceProvider";
import {handleError} from "@/app/helpers";
import {pageHeaderSelect} from "@/components/fb-page/utils";

const emit = defineEmits(["update:modelValue", "update:pageIdSelected"]);

const prop = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  pageIdSelected: {
    type: Array,
    default: () => []
  }
});

const pageList = ref([])

const selected = ref([])
const search = ref('')

const dialogValue = computed({
  get() {
    return prop.modelValue;
  },
  set(dialog: boolean) {
    emit("update:modelValue", dialog);
  },
});

watch(search, () => {
  getPageList()
})

watch(() => prop.pageIdSelected, (value: any) => {
  selected.value  = value
})

const getPageList = async () => {
  const params = {} as any
  if(search.value) {
    params.page_name = search.value
  }
  try {
    const data = await httpService.post('/fb-page/all', params)
    pageList.value = data
  } catch (e) {
    handleError(e)
  }
}

const onSelectPage = async () => {
  emit("update:pageIdSelected", selected.value);
  dialogValue.value = false;
};

onMounted(()=> {
  getPageList()
})

</script>
<template>
  <v-dialog v-model="dialogValue" width="600" scrollable>
    <v-form ref="refForm">
      <Card title="Select Page">
        <template #title-action>
          <v-btn
            variant="plain"
            icon="ph-x"
            size="small"
            @click="dialogValue = false"
          />
        </template>
        <v-card-text>
          <v-text-field
              v-model="search"
              variant="solo"
              density="compact"
              hide-details="auto"
              class="text-field-component"
              prepend-inner-icon="mdi-magnify"
          />
        </v-card-text>
        <v-card-text data-simplebar>
          <v-data-table-virtual density="compact" v-model="selected" show-select sticky :headers="pageHeaderSelect" :items="pageList" height="500" item-value="_id">
            <template v-slot:item.page_name="{item} : any">
              <span class="text-primary">{{item.page_name}}</span>
            </template>
            <template v-slot:item.stt="{index} : any">
              {{index + 1}}
            </template>
          </v-data-table-virtual>
        </v-card-text>
        <v-card-actions class="me-3 mb-2">
          <v-spacer />
          <v-btn
            variant="text"
            color="danger"
            class=""
            @click="dialogValue = false"
          >
            <i class="ph-x me-1" /> Cancel
          </v-btn>
          <v-btn
            class=""
            color="primary"
            variant="elevated"
            elevation="0"
            @click="onSelectPage"
          >
            Select Page
          </v-btn>
        </v-card-actions>
      </Card>
    </v-form>
  </v-dialog>
</template>
