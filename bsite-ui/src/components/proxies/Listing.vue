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
import {ProxyType} from "@/components/proxies/types";
import CreateEditProxyDialog from "@/components/proxies/CreateEditProxyDialog.vue";
import CreateMultipleUrlDialog from "@/components/urls/CreateMultipleUrlDialog.vue";
import CreateMultipleProxiesDialog from "@/components/proxies/CreateMultipleProxiesDialog.vue";

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
    title: 'Proxy',
    align: 'start',
    key: 'proxy',
  },
  { title: 'Description', key: 'description', align: 'start' },
  { title: 'Created at', key: 'createdAt', align: 'start' },
  { title: 'Action', key: 'action', align: 'start', sortable: false },
]) as any

const itemsPerPage = ref<number>(10)
const tableOptions = ref({})
const totalItems = ref<number>(0)
const search = ref({ key: 'name', value: ''})
const serverItems = ref([])
const loading = ref(false);

const confirmationDialog = ref(false);
const confirmationRemoveAllDialog = ref(false);

const confirmationProxy = ref<string>('');
const createEditDialog = ref(false);
const proxyDetail = ref<ProxyType | null>(null);

const { setQueryUrl } = useTable()

const loadItems = async (options: any) => {
  tableOptions.value = options
  loading.value = true
  try {
    const url = setQueryUrl(`/sites/${siteId.value}/proxies/list`, options)
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
    proxyDetail.value = data;
    createEditDialog.value = true;
  } else if (option === "remove") {
    confirmationDialog.value = true;
    confirmationProxy.value = data._id;
  }
}



watch(createEditDialog, (dialog: boolean) => {
  if (!dialog) {
    proxyDetail.value = null;
  }
});

watch(confirmationDialog, (dialog: boolean) => {
  if (!dialog) {
    confirmationProxy.value = '';
  }
});

const onUpdate = async (updatedVal: ProxyType) => {
  try {
    await httpService.patch(`/sites/${siteId.value}/proxies/${updatedVal._id}`, updatedVal)
    $toast.success('Proxy updated successfully!')
    createEditDialog.value = false;
    await loadItems(tableOptions.value)
  } catch (e) {
    handleError(e)
  }
};

const onCreate = async (newVal: { proxies: string, description?: string}) => {
  const arrayProxy = newVal.proxies.replace(/\r\n/g,"\n").split("\n")
  const filterProxy = arrayProxy.filter((proxy: string) => !!proxy.trim())
  try {
    await httpService.post(`/sites/${siteId.value}/proxies/create-bulk`, {proxies: filterProxy})
    $toast.success('Proxy created successfully!')
    createEditDialog.value = false;
    await loadItems(tableOptions.value)
  } catch (e) {
    handleError(e)
  }
};

const onAddProxyClick = () => {
  proxyDetail.value = {
    description: "",
    name:"",
    proxy: "",
    id: "",
  };
  createEditDialog.value = true;
};

const onConfirmDelete = async () => {
  try {
    await httpService.delete(`/sites/${siteId.value}/proxies/${confirmationProxy.value}`)
    $toast.success('Proxy deleted successfully!')
    confirmationDialog.value = false;
    await loadItems(tableOptions.value)
  } catch (e) {
    console.log(e)
  }
};

const onConfirmDeleteAll = async () => {
  try {
    await httpService.delete(`/sites/${siteId.value}/proxies/delete-all`)
    $toast.success('All proxies deleted successfully!')
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
        Proxy in site
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
            @click="onAddProxyClick"
        >
          <i class="ph-plus-circle mx-1" /> Add proxy
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
        <template v-slot:item.createdAt="{item}: any">
          <span class="text-muted">{{ format(item.createdAt, 'MM-dd-yyyy HH:mm')}}</span>
        </template>
        <template v-slot:item.proxy="{item}: any">
          <span class="text-primary text-decoration-underline">{{item.proxy}}</span>
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
<!--  <CreateEditProxyDialog-->
<!--    v-if="proxyDetail"-->
<!--    v-model="createEditDialog"-->
<!--    :itemDetail="proxyDetail"-->
<!--    @onUpdate="onUpdate"-->
<!--    @onCreate="onCreate"-->
<!--  />-->

  <CreateMultipleProxiesDialog
      v-if="proxyDetail"
      v-model="createEditDialog"
      :itemDetail="proxyDetail"
      @onUpdate="onUpdate"
      @onCreate="onCreate"
  />

  <RemoveItemConfirmationDialog
    v-if="confirmationProxy"
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
