<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import {httpService} from "@/app/http/httpServiceProvider";
import {handleError} from "@/app/helpers";
import {useSite} from "@/store/site";
import {addDays, format, getUnixTime} from "date-fns";
import {useToast} from "vue-toast-notification";
import ImageUploader from "@/app/common/components/ImageUploader.vue";
import PageSelectedComponent from "@/components/job-fb-page/PageSelectedComponent.vue";

const emit = defineEmits(["update:modelValue", "onUpdate", "onCreate"]);
const $toast = useToast({ position: 'top-right'});
const step = ref(1)

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

  if(step.value === 1) {
    step.value = step.value + 1;
    return
  }

  const pages = pageSelected.value.map((item: any) => {
    return {
      page_id: item._id,
      scheduled_time: item.scheduled_time ? getUnixTime(item.scheduled_time).toString() : '',
    }
  })

  const form = new FormData()
  form.append('title', title.value)
  form.append('caption', caption.value)
  form.append('pages', JSON.stringify(pages))
  form.append('file', image.value[0])
  form.append('comment', comment.value)

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
    const data = await httpService.post('/fb-page/all', {})
    pageList.value = data
  } catch (e) {
    handleError(e)
  }
}

const onChangePage = (pages:any) => {
  pageSelected.value = pages
}

onMounted(() => {
  loadItems()
})

const title = ref(prop.itemDetail?.title || "");
const caption = ref( "");
const comment = ref(`Readmore: ${prop.itemDetail?.link}`);
const image = ref()
const pageSelected = ref([])

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
        <v-card-text data-simplebar class="pa-0">
          <v-stepper
              class="bg-transparent"
              v-model="step"
              show-actions
              elevation="0"
          >
            <template v-slot:default="{ prev, next }">

              <v-stepper-header class="d-none">
                <v-stepper-item
                    :value="1"
                >
                </v-stepper-item>

                <v-stepper-item
                    :value="2"
                >
                </v-stepper-item>
              </v-stepper-header>
              <v-stepper-window>
                <v-stepper-window-item
                    :value="1"
                >
                  <v-card color="transparent" class="px-1">
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
                  </v-card>
                </v-stepper-window-item>
                <v-stepper-window-item
                    :value="2"
                >
                  <v-card color="transparent" class="px-1">
                    <v-card-text class="px-0 pt-1">
                      <page-selected-component @on-change="onChangePage" />
                    </v-card-text>
                  </v-card>
                </v-stepper-window-item>
              </v-stepper-window>
            </template>
          </v-stepper>
        </v-card-text>
        <v-card-actions class="me-3 mb-2">
          <v-btn
            variant="text"
            color="danger"
            class=""
            @click="dialogValue = false"
          >
            <i class="ph-x me-1" /> Close
          </v-btn>
          <v-spacer />
          <v-btn
              variant="text"
              color="danger"
              class=""
              :disabled="step === 1"
              @click="step = step - 1"
          >
            Previous
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            elevation="0"
            :disabled="step === 2 && pageSelected.length === 0"
            @click="onCreateUpdate"
          >
            Next
          </v-btn>
        </v-card-actions>
      </Card>
    </v-form>
  </v-dialog>
</template>
