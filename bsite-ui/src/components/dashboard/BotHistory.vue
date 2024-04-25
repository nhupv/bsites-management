<script lang="ts" setup>
import {ref, watch, computed, onMounted, onUnmounted} from "vue";
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
import Card from "@/app/common/components/Card.vue";
import ListMenu from "@/app/common/components/ListMenu.vue";
import {BotType} from "@/components/bots/types";

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
    title: 'Bot Index',
    align: 'start',
    key: 'bot_index',
  },
  { title: 'Click Ads', key: 'click_ads', align: 'start' },
  { title: 'Ip', key: 'ip', align: 'start' },
  { title: 'Notes', key: 'notes', align: 'start' },
  { title: 'Site Url', key: 'site_url', align: 'start' },
  { title: 'Steps', key: 'steps', align: 'start' },
  { title: 'Total Click Ads', key: 'total_click_ads', align: 'start' },
  { title: 'Total Views', key: 'total_views', align: 'start' },
]) as any

const itemsPerPage = ref<number>(10)
const tableOptions = ref({})
const totalItems = ref<number>(0)
const search = ref({ key: 'name', value: ''})
const serverItems = ref([])
const loading = ref(false);
const botIndex = ref<number>(-1)
const botIndexList = ref<any>([])
const intervalID = ref<null | ReturnType<typeof setTimeout>>(null)
const { setQueryUrl } = useTable()

const getBotList = async () => {
  try {
    const data = await httpService.get(`/sites/${siteId.value}/bots/list`)
    const tempData = data || []
    botIndexList.value = tempData.map((bot: any) => bot.proxy_id)
  } catch (e) {
    handleError(e)
  }
}

const loadItems = async (options: any) => {
  tableOptions.value = options
  loading.value = true
  try {
    const url = setQueryUrl(`/sites/${siteId.value}/dashboard/bot-history`, options)
    const data = await httpService.post(url, { bot_index: botIndex.value })
    serverItems.value = data.data
    totalItems.value = data.total || 0
  } catch (e) {
    handleError(e)
  } finally {
    loading.value = false
  }
}

const changeBot = (index: number) => {
  botIndex.value = index
  loadItems(tableOptions.value)
}

onMounted(() => {
  if(intervalID.value) {
    clearInterval(intervalID.value)
  }

  intervalID.value = setInterval(() => {
    loadItems(tableOptions.value)
  },300000)

  getBotList()
})

onUnmounted(() => {
  if(intervalID.value) {
    clearInterval(intervalID.value)
  }
})
</script>
<template>
  <Card title="Bot History">
    <template #title-action>
      <ListMenu title="Bot Index" is-title :list-items="[-1, ...botIndexList]" @on-change="changeBot" />
    </template>
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
<!--        <template v-slot:item.createdAt="{item} : any">-->
<!--          <span class="text-muted">{{ format(item.createdAt, 'MM-dd-yyyy HH:mm')}}</span>-->
<!--        </template>-->
        <template v-slot:item.site_url="{item}: any">
          <a class="text-primary text-decoration-underline" target="_blank" :href="item.site_url">{{item.site_url}}</a>
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
  </Card>
</template>
