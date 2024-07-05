<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import {httpService} from "@/app/http/httpServiceProvider";
import {handleError} from "@/app/helpers";
import {useSite} from "@/store/site";
import {addDays, format, getUnixTime} from "date-fns";
import {useToast} from "vue-toast-notification";
import ImageUploader from "@/app/common/components/ImageUploader.vue";

const emit = defineEmits(["update:modelValue", "onUpdate", "onCreate"]);
const $toast = useToast({ position: 'top-right'});

const refForm = ref<any>()
const formRules = {
  requiredRule: [
    (v: any) => {
        return !!v || 'Value is required.'
      }
  ]
}

const prop = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  itemDetail: {
    type: Object,
    default: () => {},
  },
});

const siteStore = useSite()

const siteId = computed(() => siteStore.siteId)

const pageList = ref([])

const dialogValue = computed({
  get() {
    return prop.modelValue;
  },
  set(dialog: boolean) {
    emit("update:modelValue", dialog);
  },
});

const onCreateUpdate = async () => {

  const { valid } = await refForm.value?.validate()
  if(!valid) return

  const form = new FormData()
  form.append('title', title.value)
  form.append('caption', caption.value)
  form.append('page_id', page.value)
  form.append('file', image.value[0])
  form.append('comment', comment.value)
  if(schedule_time.value) {
    form.append('schedule_time', getUnixTime(schedule_time.value).toString())
  }

  try {
    const data = await httpService.postForm(`/sites/${siteId.value}/posts/${prop.itemDetail?._id}/create-post`, form)
    dialogValue.value = false
    $toast.success('Create a job send post to fb page successfully!')
  } catch (e) {
    handleError(e)
  }
};


const loadItems = async () => {
  try {
    const data = await httpService.get('/fb-page/all')
    pageList.value = data
  } catch (e) {
    handleError(e)
  }
}

onMounted(() => {
  loadItems()
})

const title = ref(prop.itemDetail?.title || "");
const caption = ref( "");
const page = ref();
const comment = ref(`See more: ${prop.itemDetail?.link}`);
const schedule_time = ref();
const image = ref()

</script>
<template>
  <v-dialog v-model="dialogValue" width="800" scrollable>
    <v-form ref="refForm">
      <Card :title="'Send Post to Fb Page'">
        <template #title-action>
          <v-btn
            variant="plain"
            icon="ph-x"
            size="small"
            @click="dialogValue = false"
          />
        </template>
        <v-card-text data-simplebar>
          <h6 class="mb-2">Title</h6>
          <v-text-field
              variant="solo"
              class="text-field-component"
              density="compact"
              v-model="title"
              :rules="formRules.requiredRule"
              placeholder="Enter title here"
          />
          <v-row>
            <v-col cols="12" md="6">
              <h6 class="mb-2">Page</h6>
              <v-select
                  variant="solo"
                  :items="pageList"
                  item-value="_id"
                  item-title="page_name"
                  class="text-field-component"
                  density="compact"
                  :rules="formRules.requiredRule"
                  v-model="page"
              >
              </v-select>
            </v-col>
            <v-col cols="12" md="6">
              <h6 class="mb-2">Schedule time</h6>
              <VueDatePicker
                  v-model="schedule_time"
                  :min-date="new Date()"
                  :teleport="true"
                  auto-apply
                  time-picker-inline
                  :format="(date: Date) => date && format(date, 'LLLL dd, yyyy HH:mm')"
                  :enable-time-picker="true"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <h6 class="mb-2">Caption</h6>
              <v-textarea
                  variant="solo"
                  class="text-field-component"
                  density="compact"
                  v-model="caption"
                  :rules="formRules.requiredRule"
                  placeholder="Enter caption here"
              />
            </v-col>
            <v-col cols="12" md="6">
              <h6 class="mb-2">Comment</h6>
              <v-textarea
                  variant="solo"
                  class="text-field-component"
                  density="compact"
                  v-model="comment"
                  placeholder="Enter comment here"
              />
            </v-col>
          </v-row>
          <h6 class="mb-2">Image</h6>
          <ImageUploader :multiple="false" v-model="image" :rules="formRules.requiredRule" />
<!--          <v-file-input v-model="image"></v-file-input>-->
        </v-card-text>
        <v-card-actions class="me-3 mb-2">
          <v-spacer />
          <v-btn
            variant="text"
            color="danger"
            class=""
            @click="dialogValue = false"
          >
            <i class="ph-x me-1" /> Close
          </v-btn>
          <v-btn
            v-if="!readonly"
            class=""
            color="primary"
            variant="elevated"
            elevation="0"
            @click="onCreateUpdate"
          >
            Send
          </v-btn>
        </v-card-actions>
      </Card>
    </v-form>
  </v-dialog>
</template>
