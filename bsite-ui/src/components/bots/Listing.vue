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
import { format, formatDistance } from "date-fns";
import {useSite} from "@/store/site";
import { BotType } from "@/components/bots/types";
import CreateEditBotDialog from "@/components/bots/CreateEditBotDialog.vue";
import { botsAction } from "@/components/bots/utils";

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
    title: 'Proxy ID',
    align: 'start',
    key: 'proxy_id',
    sortable: false
  },
  { title: 'Process Main', key: 'process_main', align: 'start', sortable: false },
  { title: 'Process Sub', key: 'process_sub', align: 'start', sortable: false },
  { title: 'Last activity', key: 'last_activity', align: 'start', sortable: false },
  { title: '', key: 'time', align: 'start', sortable: false },
  // { title: 'Action', key: 'action', align: 'start', sortable: false },
]) as any

const serverItems = ref([])
const loading = ref(false);

const confirmationDialog = ref(false);
const confirmationSite = ref<string>('');
const createEditDialog = ref(false);
const botDetail = ref<BotType | null>(null);

const loadItems = async () => {
  loading.value = true
  try {
    const data = await httpService.get(`/sites/${siteId.value}/bots/list`)
    serverItems.value = data
  } catch (e) {
    handleError(e)
  } finally {
    loading.value = false
  }
}
const onSelect = (option: string, data: any) => {
  if (option === "edit") {
    botDetail.value = data;
    createEditDialog.value = true;
  } else if (option === "remove") {
    confirmationDialog.value = true;
    confirmationSite.value = data._id;
  }
}

onMounted(()=> {
  loadItems()
})



watch(createEditDialog, (dialog: boolean) => {
  if (!dialog) {
    botDetail.value = null;
  }
});

watch(confirmationDialog, (dialog: boolean) => {
  if (!dialog) {
    confirmationSite.value = '';
  }
});

const onUpdate = async (updatedVal: SiteType) => {
  try {
    await httpService.patch(`/sites/${siteId.value}/bots${updatedVal._id}`, updatedVal)
    $toast.success('Bot updated successfully!')
    createEditDialog.value = false;
    await loadItems()
  } catch (e) {
    handleError(e)
  }
};

const onCreate = async (newVal: SiteType) => {
  try {
    await httpService.post(`/sites/${siteId.value}/bots`, newVal)
    $toast.success('Bot created successfully!')
    createEditDialog.value = false;
    await loadItems()
  } catch (e) {
    handleError(e)
  }
};

const onAddBotClick = () => {
  botDetail.value = {
    description: "",
    url: "",
    id: "",
  };
  createEditDialog.value = true;
};

const onConfirmDelete = async () => {
  try {
    await httpService.delete(`/sites/${confirmationSite.value}`)
    $toast.success('Bot deleted successfully!')
    confirmationDialog.value = false;
    await loadItems()
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
        Bot in site
        <v-badge :content="serverItems.length" inline color="light" rounded="sm" />
      </div>
<!--      <v-btn-->
<!--        color="primary"-->
<!--        elevation="0"-->
<!--        class="mt-2"-->
<!--        @click="onAddBotClick"-->
<!--      >-->
<!--        <i class="ph-plus-circle mx-1" /> Add bot-->
<!--      </v-btn>-->
    </v-card-title>
    <v-card-text class="px-0">
      <v-data-table-virtual :loading="loading" sticky :headers="headers" :items="serverItems" height="500" item-value="_id">
        <template v-slot:item.proxy_id="{item} : any">
          <v-chip label color="primary" variant="tonal" density="compact">{{item.proxy_id}}</v-chip>
        </template>
        <template v-slot:item.process_main="{item: { process_main }} : any">
          <div class="mb-1">
            <span>Pid: {{ process_main?.pid }}</span>
          </div>
          <div>
            Status: <v-chip label :color="process_main.status ? 'success': 'error'" variant="tonal" density="compact">{{ process_main?.status }}</v-chip>
          </div>
        </template>
        <template v-slot:item.process_sub="{item: { process_sub }} : any">
          <div class="mb-1">
            <span>Pid: {{ process_sub?.pid }}</span>
          </div>
          <div>
            Status: <v-chip label :color="process_sub.status ? 'success': 'error'" variant="tonal" density="compact">{{ process_sub?.status }}</v-chip>
          </div>
        </template>
        <template v-slot:item.last_activity="{item} : any">
          <span>{{ format(item.last_activity, 'MM-dd-yyyy HH:mm')}}</span>
        </template>
        <template v-slot:item.time="{item} : any">
          <span class="text-muted">
            {{formatDistance(new Date(item.last_activity), new Date(), { addSuffix: true })}}
          </span>
        </template>
<!--        <template v-slot:item.action="{item}">-->
<!--          <ListMenuWithIcon :menu-items="botsAction" @onSelect="onSelect($event, item)" />-->
<!--        </template>-->
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
<!--        <template v-slot:item.url="{item} : any">-->
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
  <CreateEditBotDialog
    v-if="botDetail"
    v-model="createEditDialog"
    :itemDetail="botDetail"
    @onUpdate="onUpdate"
    @onCreate="onCreate"
  />

  <RemoveItemConfirmationDialog
    v-if="confirmationSite"
    v-model="confirmationDialog"
    @onConfirm="onConfirmDelete"
  />
</template>
