<script lang="ts" setup>
import { ref, watch, computed, onMounted } from "vue";
import RemoveItemConfirmationDialog from "@/app/common/components/RemoveItemConfirmationDialog.vue";
import {httpService} from "@/app/http/httpServiceProvider";
import {useTable} from "@/app/composables/useTable";
import ListMenuWithIcon from "@/app/common/components/ListMenuWithIcon.vue";
import {FBPageType} from "@/components/fb-page/types";
import {handleError} from "@/app/helpers";
import {useToast} from 'vue-toast-notification';
import { format } from "date-fns";
import {useSite} from "@/store/site";
import CreateEditFBPageDialog from "@/components/fb-page/CreateEditFBPageDialog.vue";
import {pageAction} from "@/components/fb-page/utils";

// const prop = defineProps({
//   filters: {
//     type: Object,
//     default: () => {},
//   },
// });

const $toast = useToast({ position: 'top-right'});

const headers = ref([
  {
    title: 'Page Name',
    align: 'start',
    key: 'page_name',
  },
  { title: 'Page url', key: 'url', align: 'start' },
  { title: 'Page id', key: 'page_id', align: 'start' },
  // { title: 'Access token', key: 'access_token', align: 'start', width: '200' },
  { title: 'Expired date', key: 'expired_date', align: 'start' },
  { title: 'Created at', key: 'createdAt', align: 'start' },
  { title: 'Action', key: 'action', align: 'start', sortable: false },
]) as any

const itemsPerPage = ref<number>(10)
const tableOptions = ref({})
const totalItems = ref<number>(0)
const search = ref({ key: 'name', value: ''})
const serverItems = ref([])
const loading = ref(false);
const siteStore = useSite()

const confirmationDialog = ref(false);
const confirmationSite = ref<string>('');
const createEditDialog = ref(false);
const pageDetail = ref<FBPageType | null>(null);

const { setQueryUrl } = useTable()

const loadItems = async (options: any) => {
  tableOptions.value = options
  loading.value = true
  try {
    const url = setQueryUrl('/fb-page/list', options)
    const data = await httpService.get(url)
    serverItems.value = data.data
    totalItems.value = data.total
  } catch (e) {
    handleError(e)
  } finally {
    loading.value = false
  }
}
const onSelect = (option: string, data: any) => {
  if (option === "edit") {
    pageDetail.value = data;
    createEditDialog.value = true;
  } else if (option === "remove") {
    confirmationDialog.value = true;
    confirmationSite.value = data._id;
  } else if (option === "push") {
    onPushData(data)
  }
}



watch(createEditDialog, (dialog: boolean) => {
  if (!dialog) {
    pageDetail.value = null;
  }
});

watch(confirmationDialog, (dialog: boolean) => {
  if (!dialog) {
    confirmationSite.value = '';
  }
});

const onPushData = async (page: FBPageType) => {
  try {
    loading.value = true
    const data = await httpService.get(`/fb-page/${page._id}/push`)
    const message = typeof  data.message !== 'string' ? String(data.message) : data.message
    $toast.success(message)
  } catch (e) {
    handleError(e)
  } finally {
    loading.value = false
  }
};

const onUpdate = async (updatedVal: FBPageType) => {
  try {
    await httpService.patch(`/fb-page/${updatedVal._id}`, updatedVal)
    $toast.success('Page updated successfully!')
    createEditDialog.value = false;
    await loadItems(tableOptions.value)
  } catch (e) {
    handleError(e)
  }
};

const onCreate = async (newVal: FBPageType) => {
  try {
    await httpService.post('/fb-page', newVal)
    $toast.success('Page created successfully!')
    createEditDialog.value = false;
    await loadItems(tableOptions.value)
  } catch (e) {
    handleError(e)
  }
};

// const updateSiteStatus = async (value: boolean, item: any) => {
//   loadingStatus.value = true
//   try {
//     await httpService.post(`/fb-page/${item._id}/status`, {status: value})
//     $toast.success('Change site status updated successfully!')
//     await siteStore.getSites()
//   } catch (e) {
//     handleError(e)
//   } finally {
//     loadingStatus.value = false
//   }
// }

const onAddProductClick = () => {
  pageDetail.value = {
    via_name: "",
    access_token: "",
    page_id: "",
    page_name: "",
    expired_date: "",
    url: "",
  };
  createEditDialog.value = true;
};

const onConfirmDelete = async () => {
  try {
    await httpService.delete(`/fb-page/${confirmationSite.value}`)
    $toast.success('Page deleted successfully!')
    confirmationDialog.value = false;
    await loadItems(tableOptions.value)
  } catch (e) {
    console.log(e)
  }
};
</script>
<template>
  <v-card>
    <v-card-title
      class="text-subtitle-1 font-weight-bold d-flex justify-space-between align-center"
    >
      <div>
        FB Page
        <v-badge :content="totalItems" inline color="light" rounded="sm" />
      </div>
      <v-btn
        color="primary"
        elevation="0"
        class="mt-2"
        @click="onAddProductClick"
      >
        <i class="ph-plus-circle mx-1" /> Add page
      </v-btn>
    </v-card-title>
    <v-card-text class="px-0">
      <v-data-table-server
          :header-props="{ class: 'font-weight-bold bg-light'}"
          class="table-component"
          v-model:items-per-page="itemsPerPage"
          :search="search.value"
          :headers="headers"
          :items-length="totalItems"
          :items="serverItems"
          :loading="loading"
          item-value="name"
          @update:options="loadItems"
      >
        <template v-slot:item.via_name="{item}: any">
          <span class="font-weight-bold">{{item.via_name}}</span>
        </template>
        <template v-slot:item.createdAt="{item}: any">
          <span class="text-muted">{{ format(item.createdAt, 'MM-dd-yyyy HH:mm')}}</span>
        </template>
        <template v-slot:item.expired_date="{item}: any">
          <span class="text-muted">{{ format(item.expired_date, 'LLLL dd, yyyy')}}</span>
        </template>
        <template v-slot:item.url="{item}: any">
          <a class="text-primary text-decoration-underline" target="_blank" :href="item.url">{{item.url}}</a>
        </template>
        <template v-slot:item.action="{item}">
          <ListMenuWithIcon :menu-items="pageAction" @onSelect="onSelect($event, item)" />
        </template>
        <template v-slot:no-data>
          <div class="text-center pa-7">
            <div class="mb-3">
              <v-avatar color="primary" variant="tonal" size="x-large">
                <i class="ph-magnifying-glass ph-lg"></i>
              </v-avatar>
            </div>
            <div class="text-subtitle-1 font-weight-bold">
              Sorry! No Result Found
            </div>
            <!--        <div class="text-muted mt-1">-->
            <!--          We've searched more than 150+ products We did not find any products-->
            <!--          for you search.-->
            <!--        </div>-->
          </div>
        </template>
      </v-data-table-server>
    </v-card-text>
  </v-card>
  <CreateEditFBPageDialog
    v-if="pageDetail"
    v-model="createEditDialog"
    :itemDetail="pageDetail"
    @onUpdate="onUpdate"
    @onCreate="onCreate"
  />

  <RemoveItemConfirmationDialog
    v-if="confirmationSite"
    v-model="confirmationDialog"
    @onConfirm="onConfirmDelete"
  />
</template>
