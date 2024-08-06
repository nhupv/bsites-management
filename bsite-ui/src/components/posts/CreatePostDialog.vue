<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import {httpService} from "@/app/http/httpServiceProvider";
import {handleError} from "@/app/helpers";
import {useSite} from "@/store/site";
import {format} from "date-fns";
import ImageUploader from "@/app/common/components/ImageUploader.vue";
import PageSelectedComponent from "@/components/job-fb-page/PageSelectedComponent.vue";

const emit = defineEmits(["update:modelValue", "onUpdate", "onCreate"]);

const refForm = ref<any>()
const step = ref(1)
const sendToPage = ref(true)

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
  itemDetail: {
    type: Object,
    default: () => {},
  },
});

const categoryList = ref([])
const siteStore = useSite()

const siteId = computed(() => siteStore.siteId)

const categoryItems = computed(() => categoryList.value.map((item: any) => ({id: item.id, name: item.name})))

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

  if(step.value === 1 && sendToPage.value) {
    step.value = step.value + 1
    return
  }
  emit("onCreate", {
    title: title.value,
    category: category.value?.name,
    category_id: category.value?.id,
    question: question.value,
    pages: pageSelected.value,
    caption: caption.value,
    comment: comment.value,
    image: image.value,
  });
};

const getCategory = async () => {
  try {
    const data = await httpService.get(`/sites/${siteId.value}/categories`)
    categoryList.value = data
  } catch (e) {
    handleError(e)
  }
}

const onChangePage = (pages:any) => {
  pageSelected.value = pages
}

onMounted(() => {
  getCategory()
})

const category = ref(prop.itemDetail?.categoryObj);
const title = ref(prop.itemDetail?.title || "");
const question = ref(prop.itemDetail?.question || "");
const caption = ref( "");
const comment = ref(`Readmore: {link}`);
const image = ref();
const pageSelected = ref([])
</script>
<template>
  <v-dialog v-model="dialogValue" width="800" scrollable>
    <v-form ref="refForm">
      <Card class="h-100" :title="'Create Post'">
        <template #title-action>
          <v-btn
              variant="plain"
              icon="ph-x"
              size="small"
              @click="dialogValue = false"
          />
        </template>
        <v-card-text data-simplebar style="max-height: 600px" class="pa-0">
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
                    <v-row>
                      <v-col cols="12" md="8">
                        <h6 class="mb-2">Title</h6>
                        <v-text-field
                            variant="solo"
                            class="text-field-component"
                            density="compact"
                            v-model="title"
                            :rules="formRules.requiredRule"
                            placeholder="Enter title here"
                        />
                      </v-col>
                      <v-col cols="12" md="4">
                        <h6 class="mb-2">Category</h6>
                        <v-select
                            variant="solo"
                            :items="categoryItems"
                            item-value="id"
                            item-title="name"
                            return-object
                            class="text-field-component"
                            placeholder="Enter category"
                            density="compact"
                            v-model="category"
                        >
                        </v-select>
                      </v-col>
                    </v-row>
                    <div>
                      <h6>Prompt</h6>
                      <v-textarea
                          variant="solo"
                          class="text-field-component"
                          density="compact"
                          rows="3"
                          hide-details="auto"
                          v-model="question"
                          :rules="formRules.requiredRule"
                          placeholder="Enter prompt here"
                      />
                    </div>
                    <div class="my-3">
                      <v-switch
                          v-model="sendToPage"
                          hide-details="auto"
                          color="primary"
                      ><template #label>
                        <span class="font-weight-bold">Send to fb page</span>
                      </template></v-switch>
                    </div>
                    <div v-if="sendToPage">
                      <v-row>
                        <v-col cols="12" md="6">
                          <h6 class="mb-2">Caption</h6>
                          <v-textarea
                              variant="solo"
                              class="text-field-component"
                              density="compact"
                              rows="3"
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
                              rows="3"
                              v-model="comment"
                              placeholder="Enter comment here"
                          />
                        </v-col>
                      </v-row>
                      <h6 class="mb-2">Image</h6>
                      <ImageUploader :multiple="false" v-model="image" :rules="formRules.requiredRule" />
                    </div>
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
              v-if="sendToPage"
              variant="text"
              color="danger"
              :disabled="step === 1"
              class=""
              @click="step = step - 1"
          >
            Previous
          </v-btn>
          <v-btn
              v-if="sendToPage"
              color="primary"
              variant="elevated"
              elevation="0"
              @click="onCreateUpdate"
          >
            Next
          </v-btn>
          <v-btn
              v-if="!sendToPage"
              color="primary"
              variant="elevated"
              elevation="0"
              @click="onCreateUpdate"
          >
            Create
          </v-btn>
        </v-card-actions>
      </Card>
    </v-form>
  </v-dialog>
</template>
