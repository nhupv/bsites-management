<script lang="ts" setup>
import { ref, watch, computed, onMounted } from "vue";
import RemoveItemConfirmationDialog from "@/app/common/components/RemoveItemConfirmationDialog.vue";
import {httpService} from "@/app/http/httpServiceProvider";
import {useTable} from "@/app/composables/useTable";
import ListMenuWithIcon from "@/app/common/components/ListMenuWithIcon.vue";
import {sitesAction} from "@/components/sites/utils";
import {handleError} from "@/app/helpers";
import {useToast} from 'vue-toast-notification';
import { format } from "date-fns";
import { ProxyType } from "@/components/proxy/types";
import CreateMultipleProxyDialog from "@/components/proxy/CreateMultipleProxyDialog.vue";
import {proxyAction} from "@/components/proxy/utils";
import {co} from "@/assets/images/flags/utils";

const $toast = useToast({ position: 'top-right'});

const headers = ref([
  {
    title: 'Proxy Url',
    align: 'start',
    key: 'proxy',
    sortable: false
  },
  { title: 'Status', key: 'status', align: 'start', sortable: false },
  { title: 'Used at', key: 'used_at', align: 'start', sortable: false },
  { title: 'Action', key: 'action', align: 'start', sortable: false },
]) as any

const itemsPerPage = ref<number>(10)
const tableOptions = ref({})
const totalItems = ref<number>(0)
const search = ref({ key: 'name', value: ''})
const serverItems = ref([])
const loading = ref(false);

const confirmationDialog = ref(false);
const confirmationProxy = ref<string>('');
const createEditDialog = ref(false);
const proxyDetail = ref<ProxyType | null>(null);

const { setQueryUrl } = useTable()

const loadItems = async () => {
  // tableOptions.value = options
  loading.value = true
  try {
    // const url = setQueryUrl(`/proxy`, options)
    const data = await httpService.get('/proxy')
    serverItems.value = data
    // totalItems.value = data.total
    loading.value = false
  } catch (e) {
    console.log(e)
  }
}
const onSelect = (option: string, data: ProxyType) => {
  if (option === "edit") {
    proxyDetail.value = data;
    createEditDialog.value = true;
  } else if (option === "remove") {
    confirmationDialog.value = true;
    confirmationProxy.value = data.proxy || '';
  }
}

onMounted(()=> {
  loadItems()
})

const getStatusColor = (status: string) => {
  let color = 'secondary'
  switch (status) {
    case 'in-use':
      color = 'error'
      break;
    case 'not-in-use':
      color = 'success'
      break;
    default:
      color = 'secondary'
  }
  return color
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

const onCreate = async (newVal: { proxies: string }) => {
  const arrayProxy = newVal.proxies.replace(/\r\n/g,"\n").split("\n")
  const filterProxy = arrayProxy.filter((proxy: string) => !!proxy.trim())
  try {
    await httpService.post(`/proxy`, {proxies: filterProxy})
    $toast.success('Proxies created successfully!')
    createEditDialog.value = false;
    await loadItems()
  } catch (e) {
    handleError(e)
  }
};

const onAddUrlClick = () => {
  proxyDetail.value = {
    proxy: "",
  };
  createEditDialog.value = true;
};

const onConfirmDelete = async () => {
  try {
    await httpService.deleteWithData(`/proxy`, { data: { proxy_url: confirmationProxy.value }})
    $toast.success('Proxy deleted successfully!')
    confirmationDialog.value = false;
    await loadItems()
  } catch (e) {
    handleError(e)
  }
};

</script>
<template>
  <v-card>
    <v-card-title
      class="text-subtitle-1 font-weight-bold d-flex justify-space-between align-center"
    >
      <div>
        Proxy
        <v-badge :content="serverItems.length" inline color="light" rounded="sm" />
      </div>
      <div>
        <v-btn
            color="primary"
            elevation="0"
            class="my-2"
            @click="onAddUrlClick"
        >
          <i class="ph-plus-circle mx-1" /> Add proxy
        </v-btn>
      </div>
    </v-card-title>
    <v-card-text class="px-0">
      <v-data-table-virtual :loading="loading" sticky :headers="headers" :items="serverItems" height="500" item-value="_id">
        <template v-slot:item.proxy="{item} : any">
          <span class="text-primary">{{item.proxy}}</span>
        </template>
        <template v-slot:item.status="{item} : any">
          <v-chip label :color="getStatusColor(item.status)" variant="tonal" density="compact">{{ item.status }}</v-chip>
        </template>
        <template v-slot:item.action="{item}">
          <ListMenuWithIcon :menu-items="proxyAction" @onSelect="onSelect($event, item)" />
        </template>
      </v-data-table-virtual>
<!--      <v-data-table-server-->
<!--          :header-props="{ class: 'font-weight-bold bg-light'}"-->
<!--          class="table-component"-->
<!--          v-model:items-per-page="itemsPerPage"-->
<!--          :search="search.value"-->
<!--          :headers="headers"-->
<!--          :items-length="totalItems"-->
<!--          :items="serverItems"-->
<!--          :loading="loading"-->
<!--          item-value="name"-->
<!--          @update:options="loadItems"-->
<!--      >-->
<!--        <template v-slot:item.createdAt="{item} : any">-->
<!--          <span class="text-muted">{{ format(item.createdAt, 'MM-dd-yyyy HH:mm')}}</span>-->
<!--        </template>-->
<!--        <template v-slot:item.url="{item}: any">-->
<!--          <a class="text-primary text-decoration-underline" target="_blank" :href="item.url">{{item.url}}</a>-->
<!--        </template>-->
<!--        <template v-slot:item.action="{item}">-->
<!--          <ListMenuWithIcon :menu-items="sitesAction" @onSelect="onSelect($event, item)" />-->
<!--        </template>-->
<!--        <template v-slot:no-data>-->
<!--          <div class="text-center pa-7">-->
<!--            <div class="mb-3">-->
<!--              <v-avatar color="primary" variant="tonal" size="x-large">-->
<!--                <i class="ph-magnifying-glass ph-lg"></i>-->
<!--              </v-avatar>-->
<!--            </div>-->
<!--            <div class="text-subtitle-1 font-weight-bold">-->
<!--              Sorry! No Result Found-->
<!--            </div>-->
<!--            &lt;!&ndash;        <div class="text-muted mt-1">&ndash;&gt;-->
<!--            &lt;!&ndash;          We've searched more than 150+ products We did not find any products&ndash;&gt;-->
<!--            &lt;!&ndash;          for you search.&ndash;&gt;-->
<!--            &lt;!&ndash;        </div>&ndash;&gt;-->
<!--          </div>-->
<!--        </template>-->
<!--      </v-data-table-server>-->

    </v-card-text>
  </v-card>

  <CreateMultipleProxyDialog
      v-if="proxyDetail"
      v-model="createEditDialog"
      :itemDetail="proxyDetail"
      @onCreate="onCreate"
  />

  <RemoveItemConfirmationDialog
    v-if="confirmationProxy"
    v-model="confirmationDialog"
    @onConfirm="onConfirmDelete"
  />

</template>
