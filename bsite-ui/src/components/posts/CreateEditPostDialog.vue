<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import { v4 as uuidv4 } from "uuid";
import { formateDate } from "@/app/common/dateFormate";
import {httpService} from "@/app/http/httpServiceProvider";
import {handleError} from "@/app/helpers";
import {useSite} from "@/store/site";
import {read} from "@amcharts/amcharts5/.internal/bundled/xlsx";

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

const isCreate = computed(() => {
  return !prop.itemDetail?._id;
});

const onCreateUpdate = async () => {

  const { valid } = await refForm.value?.validate()
  if(!valid) return

  if (!isCreate.value) {
    emit("onUpdate", {
      ...prop.itemDetail,
      title: title.value,
      category: category.value?.name,
      category_id: category.value?.id,
      content: content.value,
      question: question.value,
    });
  }
};

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
  <v-dialog v-model="dialogValue" width="900" scrollable>
    <v-form ref="refForm">
      <Card :title="readonly ? 'View Content' : 'Update Post'">
        <template #title-action>
          <v-btn
            variant="plain"
            icon="ph-x"
            size="small"
            @click="dialogValue = false"
          />
        </template>
        <v-card-text data-simplebar>
          <v-row v-if="!readonly">
            <v-col cols="12" md="6">
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
            <v-col cols="12" md="6">
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
          <div v-if="!readonly">
            <h6 class="mb-2">Question</h6>
            <v-text-field
                variant="solo"
                class="text-field-component"
                density="compact"
                v-model="question"
                :rules="formRules.requiredRule"
                placeholder="Enter title here"
            />
          </div>
          <h6 class="mb-2">Content</h6>
          <v-textarea
              variant="solo"
              :rows="30"
              class="text-field-component"
              density="compact"
              :readonly="readonly"
              v-model="content"
              placeholder="Enter content"
          />
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
            {{ !isCreate ? "Update" : "Add Post" }}
          </v-btn>
        </v-card-actions>
      </Card>
    </v-form>
  </v-dialog>
</template>
