<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import {httpService} from "@/app/http/httpServiceProvider";
import {handleError} from "@/app/helpers";
import {useSite} from "@/store/site";

const emit = defineEmits(["update:modelValue", "onUpdate", "onCreate"]);

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

const onUpdatePost = async () => {
  const { valid } = await refForm.value?.validate()
  if(!valid) return
  emit("onUpdate", {
    ...prop.itemDetail,
    title: title.value,
    category: category.value?.name,
    category_id: category.value?.id,
    content: content.value,
    question: question.value,
  });
}

const getCategory = async () => {
  try {
    const data = await httpService.get(`/sites/${siteId.value}/categories`)
    categoryList.value = data
  } catch (e) {
    handleError(e)
  }
}

onMounted(() => {
  getCategory()
})

const content = ref(prop.itemDetail?.content || "");
const category = ref(prop.itemDetail?.categoryObj);
const title = ref(prop.itemDetail?.title || "");
const question = ref(prop.itemDetail?.question || "");
</script>
<template>
  <v-dialog v-model="dialogValue" width="800" scrollable>
    <v-form ref="refForm">
      <Card class="h-100" title="Update Post">
        <template #title-action>
          <v-btn
              variant="plain"
              icon="ph-x"
              size="small"
              @click="dialogValue = false"
          />
        </template>
        <v-card-text data-simplebar style="max-height: 600px" class="py-0">
            <v-row>
              <v-col cols="12" md="8">
                <h6 class="mb-2">Title</h6>
                <v-text-field
                    variant="solo"
                    class="text-field-component"
                    density="compact"
                    v-model="title"
                    :readonly="readonly"
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
                    :readonly="readonly"
                    class="text-field-component"
                    placeholder="Enter category"
                    density="compact"
                    v-model="category"
                >
                </v-select>
              </v-col>
            </v-row>
            <div>
              <h6 class="mb-2">Prompt</h6>
              <v-textarea
                  variant="solo"
                  class="text-field-component"
                  density="compact"
                  rows="3"
                  :readonly="readonly"
                  v-model="question"
                  :rules="formRules.requiredRule"
                  placeholder="Enter prompt here"
              />
            </div>
            <div>
              <h6 class="mb-2">Content</h6>
              <v-textarea
                  variant="solo"
                  :rows="10"
                  class="text-field-component"
                  density="compact"
                  :readonly="readonly"
                  v-model="content"
                  placeholder="Enter content"
              />
            </div>
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
              @click="onUpdatePost"
          >
            Update
          </v-btn>
        </v-card-actions>
      </Card>
    </v-form>
  </v-dialog>
</template>
