<script lang="ts" setup>
import { ref, watch, computed, onMounted } from "vue";
import RemoveItemConfirmationDialog from "@/app/common/components/RemoveItemConfirmationDialog.vue";
import {httpService} from "@/app/http/httpServiceProvider";
import {useTable} from "@/app/composables/useTable";
import ListMenuWithIcon from "@/app/common/components/ListMenuWithIcon.vue";
import {sitesAction} from "@/components/sites/utils";
import {SiteType} from "@/components/sites/types";
import {handleError} from "@/app/helpers";
import {useToast} from 'vue-toast-notification';
import { format } from "date-fns";
import {useSite} from "@/store/site";
import {UrlType} from "@/components/urls/types";
import CreateEditUrlDialog from "@/components/urls/CreateEditUrlDialog.vue";
import CreateMultipleUrlDialog from "@/components/urls/CreateMultipleUrlDialog.vue";

// const prop = defineProps({
//   filters: {
//     type: Object,
//     default: () => {},
//   },
// });

const $toast = useToast({ position: 'top-right'});
const siteStore = useSite()

const siteId = computed(()=> siteStore.siteId)

const headers = ref([
  {
    title: 'Url',
    align: 'start',
    key: 'url',
  },
  { title: 'Description', key: 'description', align: 'start' },
  { title: 'Created at', key: 'createdAt', align: 'start' },
  { title: 'Action', key: 'action', align: 'start', sortable: false },
])

const itemsPerPage = ref<number>(10)
const tableOptions = ref({})
const totalItems = ref<number>(0)
const search = ref({ key: 'name', value: ''})
const serverItems = ref([])
const loading = ref(false);

const confirmationDialog = ref(false);
const confirmationRemoveAllDialog = ref(false);
const confirmationUrl = ref<string>('');
const createEditDialog = ref(false);
const urlDetail = ref<UrlType | null>(null);

const { setQueryUrl } = useTable()

const loadItems = async (options: any) => {
  tableOptions.value = options
  loading.value = true
  try {
    const url = setQueryUrl(`/sites/${siteId.value}/urls/list`, options)
    const data = await httpService.get(url)
    serverItems.value = data.data
    totalItems.value = data.total
    loading.value = false
  } catch (e) {
    console.log(e)
  }
}
const onSelect = (option: string, data: any) => {
  if (option === "edit") {
    urlDetail.value = data;
    createEditDialog.value = true;
  } else if (option === "remove") {
    confirmationDialog.value = true;
    confirmationUrl.value = data._id;
  }
}



watch(createEditDialog, (dialog: boolean) => {
  if (!dialog) {
    urlDetail.value = null;
  }
});

watch(confirmationDialog, (dialog: boolean) => {
  if (!dialog) {
    confirmationUrl.value = '';
  }
});

const onUpdate = async (updatedVal: SiteType) => {
  try {
    await httpService.patch(`/sites/${siteId.value}/urls/${updatedVal._id}`, updatedVal)
    $toast.success('Url updated successfully!')
    createEditDialog.value = false;
    await loadItems(tableOptions.value)
  } catch (e) {
    handleError(e)
  }
};

const onCreate = async (newVal: { urls: string, description?: string}) => {
  const arrayUrl = newVal.urls.replace(/\r\n/g,"\n").split("\n")
  const filterUrl = arrayUrl.filter((url: string) => !!url.trim())
  try {
    await httpService.post(`/sites/${siteId.value}/urls/create-bulk`, {urls: filterUrl})
    $toast.success('Url created successfully!')
    createEditDialog.value = false;
    await loadItems(tableOptions.value)
  } catch (e) {
    handleError(e)
  }
};

const onAddUrlClick = () => {
  urlDetail.value = {
    description: "",
    url: "",
    id: "",
  };
  createEditDialog.value = true;
};

const onConfirmDelete = async () => {
  try {
    await httpService.delete(`/sites/${siteId.value}/urls/${confirmationUrl.value}`)
    $toast.success('Url deleted successfully!')
    confirmationDialog.value = false;
    await loadItems(tableOptions.value)
  } catch (e) {
    handleError(e)
  }
};

const onConfirmDeleteAll = async () => {
  try {
    await httpService.delete(`/sites/${siteId.value}/urls/delete-all`)
    $toast.success('All urls deleted successfully!')
    confirmationRemoveAllDialog.value = false;
    await loadItems(tableOptions.value)
  } catch (e) {
    handleError(e)
  }
}
</script>
<template>
  <v-card>
    <v-card-title
      class="text-subtitle-1 font-weight-bold d-flex justify-space-between align-center"
    >
      <div>
        Url in site
        <v-badge :content="totalItems" inline color="light" rounded="sm" />
      </div>
      <div>
        <v-btn
            v-if="totalItems"
            color="error"
            elevation="0"
            class="my-2 mr-4"
            @click="confirmationRemoveAllDialog = true"
        >
          <i class="ph-trash mx-1" /> Delete all
        </v-btn>
        <v-btn
            color="primary"
            elevation="0"
            class="my-2"
            @click="onAddUrlClick"
        >
          <i class="ph-plus-circle mx-1" /> Add url
        </v-btn>
      </div>
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
        <template v-slot:item.createdAt="{item}">
          <span class="text-muted">{{ format(item.createdAt, 'MM-dd-yyyy HH:mm')}}</span>
        </template>
        <template v-slot:item.url="{item}">
          <a class="text-primary text-decoration-underline" target="_blank" :href="item.url">{{item.url}}</a>
        </template>
        <template v-slot:item.action="{item}">
          <ListMenuWithIcon :menu-items="sitesAction" @onSelect="onSelect($event, item)" />
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
<!--  <CreateEditUrlDialog-->
<!--    v-if="urlDetail"-->
<!--    v-model="createEditDialog"-->
<!--    :itemDetail="urlDetail"-->
<!--    @onUpdate="onUpdate"-->
<!--    @onCreate="onCreate"-->
<!--  />-->

  <CreateMultipleUrlDialog
      v-if="urlDetail"
      v-model="createEditDialog"
      :itemDetail="urlDetail"
      @onUpdate="onUpdate"
      @onCreate="onCreate"
  />

  <RemoveItemConfirmationDialog
    v-if="confirmationUrl"
    v-model="confirmationDialog"
    @onConfirm="onConfirmDelete"
  />

  <RemoveItemConfirmationDialog
      v-if="confirmationRemoveAllDialog"
      delete-all
      v-model="confirmationRemoveAllDialog"
      @onConfirm="onConfirmDeleteAll"
  />
</template>
