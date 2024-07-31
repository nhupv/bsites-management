<script lang="ts" setup>
import { ref, watch, computed, onMounted } from "vue";
import RemoveItemConfirmationDialog from "@/app/common/components/RemoveItemConfirmationDialog.vue";
import {httpService} from "@/app/http/httpServiceProvider";
import {useTable} from "@/app/composables/useTable";
import ListMenuWithIcon from "@/app/common/components/ListMenuWithIcon.vue";
import {FBPageType} from "@/components/fb-page/types";
import {handleError} from "@/app/helpers";
import {useToast} from 'vue-toast-notification';
import {format, getUnixTime} from "date-fns";
import {useSite} from "@/store/site";
import CreatePostPageDialog from "@/components/job-fb-page/CreatePostPageDialog.vue";
import {pageAction} from "@/components/job-fb-page/utils";
import {clip} from "../posts/utils";

// const prop = defineProps({
//   filters: {
//     type: Object,
//     default: () => {},
//   },
// });

const $toast = useToast({ position: 'top-right'});

const headers = ref([
  {
    title: '#',
    align: 'start',
    key: 'id',
  },
  {
    title: 'Job Name',
    align: 'start',
    key: 'name',
  },
  // { title: 'Data', key: 'data', align: 'start' },
  // { title: 'Access token', key: 'access_token', align: 'start', width: '200' },
  { title: 'Page', key: 'data', align: 'start' },
  { title: 'Title', key: 'title', align: 'start', width: '300' },
  { title: 'Comment', key: 'comment', align: 'start', width: '200' },
  { title: 'Scheduled time', key: 'scheduled_time', align: 'start' },
  // { title: 'Finished On', key: 'finishedOn', align: 'start' },
  // { title: 'Created at', key: 'createdAt', align: 'start' },
  // { title: 'Action', key: 'action', align: 'start', sortable: false },
]) as any

const dynamicHeaders = computed(() => {
  return types.value === 'failed' ? [...headers.value,
    { title: 'Error', key: 'reason', align: 'start' }] :
      headers.value
})

const serverItems = ref([])
const loading = ref(false);
const types = ref('completed');

const confirmationDialog = ref(false);
const confirmationSite = ref<string>('');
const createEditDialog = ref(false);
const pageDetail = ref<FBPageType | null>(null);

const loadItems = async () => {
  loading.value = true
  try {
    // const url = setQueryUrl('/jobs/list', options)
    const data = await httpService.post('/jobs/list', {types: [types.value]})
    serverItems.value = data
    // totalItems.value = data.total
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
    await loadItems()
  } catch (e) {
    handleError(e)
  }
};

const onCreate = async (data: any) => {
  const pages = data.pages.map((item: any) => {
    return {
      page_id: item._id,
      page_name: item.page_name,
      scheduled_time: item.scheduled_time ? getUnixTime(item.scheduled_time).toString() : '',
    }
  })
  const form = new FormData()
  form.append('url', data.url)
  form.append('caption_prompt', data.caption_prompt)
  form.append('file', data.image[0])
  form.append('pages', JSON.stringify(pages))
  try {
    await httpService.postForm('/jobs/fb-pages', form)
    $toast.success('Add jobs create fb page successfully!')
    createEditDialog.value = false;
    await loadItems()
  } catch (e) {
    handleError(e)
  }
};

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

watch(types, (value) => {
  loadItems()
})

const onConfirmDelete = async () => {
  try {
    await httpService.delete(`/fb-page/${confirmationSite.value}`)
    $toast.success('Page deleted successfully!')
    confirmationDialog.value = false;
    await loadItems()
  } catch (e) {
    console.log(e)
  }
};

const json_fields = ref({
    "Page": "data.payload.page_name",
    "Page ID": "data.payload.page_id",
    "Caption": "data.payload.title",
    "Link": "data.payload.link",
    "Scheduled Time": {
      field: "data.payload.schedule_time",
      callback: (value: any) => {
        return value ? format(new Date(parseInt(value) * 1000), 'LLLL dd yyyy HH:mm') : ''
      },
    },
})

onMounted(() => {
  loadItems()
})
</script>
<template>
  <v-card>
    <v-card-title
      class="text-subtitle-1 font-weight-bold d-flex justify-space-between align-center"
    >
      <div>
        Page Job
      </div>
      <v-spacer />
      <v-btn-toggle
          v-model="types"
          divided
          density="compact"
          color="primary"
          class="mt-2 mr-4"
          mandatory
      >
        <v-btn size="x-small" value="active">Active</v-btn>
        <v-btn size="x-small" value="completed">Completed</v-btn>
        <v-btn size="x-small" value="failed">Failed</v-btn>
      </v-btn-toggle>
      <download-excel
          worksheet="My Worksheet"
          :data="serverItems"
          :fields="json_fields"
          type="csv"
          name="fb-page-job.xls"
          :escapeCsv="false"
      >
        <v-btn
            color="primary"
            variant="outlined"
            elevation="0"
            class="mt-2 mr-2"
        >
          <i class="ph-file-arrow-down mx-1" /> CSV
        </v-btn>
      </download-excel>

      <v-btn
        color="primary"
        elevation="0"
        class="mt-2"
        @click="onAddProductClick"
      >
        <i class="ph-plus-circle mx-1" /> Create Post
      </v-btn>
    </v-card-title>
    <v-card-text class="px-0">
      <v-data-table-virtual
          :header-props="{ class: 'font-weight-bold bg-light'}"
          height="550"
          :headers="dynamicHeaders"
          :items="serverItems"
          :loading="loading"
          sticky
          item-value="id"
      >
        <template v-slot:item.via_name="{item}: any">
          <span class="font-weight-bold">{{item.via_name}}</span>
        </template>
        <template v-slot:item.data="{item}: any">
          <span class="text-muted">{{ item.data?.payload?.page_name}}</span>
        </template>
        <template v-slot:item.title="{item}: any">
          <span class="text-muted">{{ clip(item.data?.payload?.title, 150) }}</span>
        </template>
        <template v-slot:item.scheduled_time="{item}: any">
          <span class="text-muted">
            {{item.data?.payload?.schedule_time && format(parseInt(item.data?.payload?.schedule_time )*1000, 'LLLL dd, yyyy HH:mm')}}
          </span>
        </template>
        <template v-slot:item.comment="{item}: any">
          {{item.data?.payload?.comment}}
        </template>

        <template v-slot:item.reason="{item}: any">
          <span class="text-error">{{item.failedReason}}</span>
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
      </v-data-table-virtual>
    </v-card-text>
  </v-card>
  <CreatePostPageDialog
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
