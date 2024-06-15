<script lang="ts" setup>
import { ref, watch, computed, onMounted } from "vue";
import RemoveItemConfirmationDialog from "@/app/common/components/RemoveItemConfirmationDialog.vue";
import {httpService} from "@/app/http/httpServiceProvider";
import {useTable} from "@/app/composables/useTable";
import ListMenuWithIcon from "@/app/common/components/ListMenuWithIcon.vue";
import {clip, postsAction} from "@/components/posts/utils";
import {handleError} from "@/app/helpers";
import {useToast} from 'vue-toast-notification';
import { format } from "date-fns";
import {useSite} from "@/store/site";
import {KeywordType} from "@/components/keywords/types";
import {PostReq, PostStatus, PostType} from "@/components/posts/types";
import CreateMultiplePostDialog from "@/components/posts/CreateMultiplePostDialog.vue";
import CreateEditPostDialog from "@/components/posts/CreateEditPostDialog.vue";

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
    title: 'Title',
    align: 'start',
    key: 'title',
    width: '15%',
  },
  { title: 'Category', key: 'category', align: 'start', },
  { title: 'Content', key: 'content', align: 'start', width: '30%' },
  { title: 'Link', key: 'link', align: 'start', width: '10%' },
  { title: 'Priority', key: 'priority', align: 'start' },
  { title: 'Status', key: 'status', align: 'start', sortable: false, width: '15%' },
  { title: 'Created at', key: 'createdAt', align: 'start' },
  { title: 'Action', key: 'action', align: 'start', sortable: false },
]) as any

const itemsPerPage = ref<number>(10)
const tableOptions = ref({})
const totalItems = ref<number>(0)
const search = ref({ key: 'name', value: ''})
const serverItems = ref([])
const loading = ref(false);
const readOnly = ref(false);
const loadingPriority = ref(false)

const confirmationDialog = ref(false);
// const confirmationRemoveAllDialog = ref(false);
const confirmationContent = ref<string>('');
const createEditDialog = ref(false);
const createMultiDialog = ref(false);
const postReq = ref<PostReq | null>(null);
const postDetail = ref<PostType | null>(null);

const { setQueryUrl } = useTable()

const loadItems = async (options: any) => {
  tableOptions.value = options
  loading.value = true
  try {
    const url = setQueryUrl(`/sites/${siteId.value}/posts/list`, options)
    const data = await httpService.get(url)
    serverItems.value = data.data
    totalItems.value = data.total
    loading.value = false
  } catch (e) {
    handleError(e)
  }
}
const onSelect = (option: string, data: any) => {
  if (option === "edit") {
    postDetail.value = data;
    if(postDetail.value && data.category && data.category_id) {
      postDetail.value.categoryObj = {
        name: data.category,
        id: data.category_id,
      }
    }
    createEditDialog.value = true;
  } else if (option === "remove") {
    confirmationDialog.value = true;
    confirmationContent.value = data._id;
  } else if (option === "rewrite") {
    onRewrite(data._id)
  } else if (option === "recreate") {
    onRecreate(data._id)
  }
}



watch(createEditDialog, (dialog: boolean) => {
  if (!dialog) {
    postDetail.value = null;
    readOnly.value = false;
  }
});

watch(createMultiDialog, (dialog: boolean) => {
  if (!dialog) {
    postReq.value = null;
  }
});

watch(confirmationDialog, (dialog: boolean) => {
  if (!dialog) {
    confirmationContent.value = '';
  }
});

const onPushData = async () => {
  loading.value = true;
  try {
    const data = await httpService.get(`/sites/${siteId.value}/posts/push`)
    const message = typeof  data.message !== 'string' ? String(data.message) : data.message
    $toast.success(message)
  } catch (e) {
    handleError(e)
  } finally {
    loading.value = false
  }
};

const onUpdate = async (updatedVal: PostType) => {
  try {
    const data = await httpService.patch(`/sites/${siteId.value}/posts/${updatedVal._id}`, updatedVal)
    $toast.success(data.message)
    createEditDialog.value = false;
    await loadItems(tableOptions.value)
  } catch (e) {
    handleError(e)
  }
};


const onCreate = async (newVal: { titles: string, category?: any}) => {
  const arrayTitle = newVal.titles.replace(/\r\n/g,"\n").split("\n")
  const filterTitle = arrayTitle.filter((title: string) => !!title.trim())
  try {
    const data = await httpService.post(`/sites/${siteId.value}/posts/create-bulk`,
        {titles: filterTitle, category: newVal.category?.name, category_id: newVal.category?.id}
    )
    $toast.success(data.message)
    createMultiDialog.value = false;
    await loadItems(tableOptions.value)
  } catch (e) {
    handleError(e)
  }
};

const updatePostPriority = async (value: boolean, item: any) => {
  loadingPriority.value = true
  try {
    await httpService.post(`/sites/${siteId.value}/posts/${item._id}/priority`, {priority: value})
    $toast.success('Update priority successfully!')
    await siteStore.getSites()
  } catch (e) {
    handleError(e)
  } finally {
    loadingPriority.value = false
  }
}

const onRewrite = async (id: string) => {
  loading.value = true;
  try {
    const data = await httpService.get(`/sites/${siteId.value}/posts/${id}/rewrite`)
    const message = typeof  data.message !== 'string' ? String(data.message) : data.message
    $toast.success(message)
  } catch (e) {
    handleError(e)
  } finally {
    loading.value = false
  }
};

const onRecreate = async (id: string) => {
  loading.value = true;
  try {
    const data = await httpService.get(`/sites/${siteId.value}/posts/${id}/recreate`)
    const message = typeof  data.message !== 'string' ? String(data.message) : data.message
    $toast.success(message)
  } catch (e) {
    handleError(e)
  } finally {
    loading.value = false
  }
};

const onAddUrlClick = () => {
  postReq.value = {
    titles: "",
    category: null,
  };
  createMultiDialog.value = true;
};

const onConfirmDelete = async () => {
  try {
    await httpService.delete(`/sites/${siteId.value}/posts/${confirmationContent.value}`)
    $toast.success('Post deleted successfully!')
    confirmationDialog.value = false;
    await loadItems(tableOptions.value)
  } catch (e) {
    handleError(e)
  }
};

const showPost = (data: any) => {
  readOnly.value = true;
  postDetail.value = data;
  createEditDialog.value = true;
}

const deletePortal = async () => {
  await httpService.delete(`/sites/${siteId.value}/posts/delete-all`)
  $toast.success('Posts deleted successfully!')
  confirmationDialog.value = false;
  await loadItems(tableOptions.value)
}

const deleteBoth = async () => {
  await httpService.delete(`/sites/${siteId.value}/posts/delete-both`)
  $toast.success('Posts deleted successfully!')
  confirmationDialog.value = false;
  await loadItems(tableOptions.value)
}

const getVariantStatus = (status: string) => {
  const variant = {
    color: 'secondary',
    text: status,
    icon: 'mdi-check',
  }
  switch (status) {
    case PostStatus.PROCESSING:
      variant.color = 'success'
      break
    case PostStatus.SEND_CHATGPT_SUCCESS:
      variant.color = 'success'
      break
    case PostStatus.SEND_CONTENT_SUCCESS:
      variant.color = 'success'
      break
    case PostStatus.SEND_CHATGPT_FAILED:
      variant.color = 'error';
      variant.icon = 'mdi-close'
      break
    case PostStatus.SEND_CONTENT_FAILED:
      variant.color = 'error';
      variant.icon = 'mdi-close'
      break

    case PostStatus.SEND_DELETE_POST_FAILED:
      variant.color = 'error';
      variant.icon = 'mdi-close'
      break

    case PostStatus.SEND_UPDATE_POST_SUCCESS:
      variant.color = 'success'
      break

    case PostStatus.SEND_UPDATE_POST_FAILED:
      variant.color = 'error';
      variant.icon = 'mdi-close'
      break
  }
  return variant
}

// const onConfirmDeleteAll = async () => {
//   try {
//     await httpService.delete(`/sites/${siteId.value}/keywords/delete-all`)
//     $toast.success('All keywords deleted successfully!')
//     confirmationRemoveAllDialog.value = false;
//     await loadItems(tableOptions.value)
//   } catch (e) {
//     handleError(e)
//   }
// }
</script>
<template>
  <v-card>
    <v-card-title
      class="text-subtitle-1 font-weight-bold d-flex justify-space-between align-center"
    >
      <div>
        Post in site
        <v-badge :content="totalItems" inline color="light" rounded="sm" />
      </div>
      <div>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
                v-if="serverItems.length > 0"
                color="error"
                class="mr-4"
                v-bind="props"
            >
              Delete all
            </v-btn>
          </template>
          <v-list nav density="compact">
            <v-list-item @click="deletePortal" link>
              <v-list-item-title>For portal</v-list-item-title>
            </v-list-item>
            <v-list-item @click="deleteBoth" link>
              <v-list-item-title>For both</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn
            :disabled="totalItems === 0"
            :loading="loading"
            color="primary"
            variant="outlined"
            elevation="0"
            class="my-2 mr-4"
            @click="onPushData"
        >
          <i class="ph-paper-plane-tilt mx-1" /> Push data
        </v-btn>
        <v-btn
            color="primary"
            elevation="0"
            class="my-2"
            @click="onAddUrlClick"
        >
          <i class="ph-plus-circle mx-1" /> Add Post
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
        <template v-slot:item.priority="{item}: any">
          <v-switch
              v-model="item.priority"
              :loading="loadingPriority"
              hide-details
              color="primary"
              size="sm"
              @update:modelValue="(value) => updatePostPriority(value, item)"
          ></v-switch>
        </template>
        <template v-slot:item.status="{item}: any">
          <template v-for="s in item.status" :key="s">
            <v-tooltip height="30" contained location="top" :text="getVariantStatus(s).text">
              <template v-slot:activator="{ props }">
                <v-btn
                    v-bind="props"
                    :color="getVariantStatus(s).color"
                    size="small"
                    class="me-3"
                    density="compact"
                    variant="outlined"
                    :icon="getVariantStatus(s).icon"
                    label
                    />
                    </template>
            </v-tooltip>
          </template>
        </template>
        <template v-slot:item.createdAt="{item} : any">
          <span class="text-muted">{{ format(item.createdAt, 'MM-dd-yyyy HH:mm')}}</span>
        </template>
        <template v-slot:item.content="{item} : any">
          {{ clip(item.content, 150) }}
        </template>
        <template v-slot:item.title="{item} : any">
          <span class="font-weight-bold">{{item.title}}</span>
        </template>
        <template v-slot:item.link="{item} : any">
          <a class="text-primary" :href="item.link" target="_blank">{{item.link}}</a>
        </template>
        <template v-slot:item.action="{item}">
          <div class="d-flex justify-center align-center">
            <v-btn @click="showPost(item)" size="small" variant="plain" icon><v-icon>mdi-eye</v-icon></v-btn>
            <ListMenuWithIcon :menu-items="postsAction" @onSelect="onSelect($event, item)" />
          </div>
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
  <CreateEditPostDialog
    v-if="postDetail"
    v-model="createEditDialog"
    :itemDetail="postDetail"
    :readonly="readOnly"
    @onUpdate="onUpdate"
  />
  <CreateMultiplePostDialog
      v-if="postReq"
      v-model="createMultiDialog"
      :itemDetail="postReq"
      @onCreate="onCreate"
  />

  <RemoveItemConfirmationDialog
    v-if="confirmationContent"
    v-model="confirmationDialog"
    @onConfirm="onConfirmDelete"
  />

<!--  <RemoveItemConfirmationDialog-->
<!--      v-if="confirmationRemoveAllDialog"-->
<!--      delete-all-->
<!--      v-model="confirmationRemoveAllDialog"-->
<!--      @onConfirm="onConfirmDeleteAll"-->
<!--  />-->
</template>
