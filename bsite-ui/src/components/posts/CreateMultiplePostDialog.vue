<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import TextArea from "@/app/common/validationComponents/TextArea.vue";
import {httpService} from "@/app/http/httpServiceProvider";
import {handleError} from "@/app/helpers";
import {useSite} from "@/store/site";

const emit = defineEmits(["update:modelValue", "onUpdate", "onCreate"]);

const refForm = ref<any>()
const formRules = {
  requiredRule: [
    // (v: any) => {
    //     return !!v || 'Value is required.'
    //   },
    (v: string[]) => {
      return !!v && v.length > 0 || 'Value is required.'
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

const siteStore = useSite()

const siteId = computed(()=> siteStore.siteId)

const onCreateUpdate = async () => {

  const { valid } = await refForm.value?.validate()
  if(!valid) return

  if (isCreate.value) {
    emit("onCreate", {
      category: category.value,
      titles: titles.value,
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

const category = ref(null);
const titles = ref(prop.itemDetail?.titles || "");
</script>
<template>
  <v-dialog v-model="dialogValue" width="600" scrollable>
    <v-form ref="refForm">
      <Card :title="!isCreate ? 'Edit Post' : 'Add Post'">
        <template #title-action>
          <v-btn
            variant="plain"
            icon="ph-x"
            size="small"
            @click="dialogValue = false"
          />
        </template>
        <v-card-text data-simplebar style="max-height: 500px">
          <h6 class="mb-2">Title</h6>
          <TextArea v-model="titles"
                    :rules="formRules.requiredRule"
                    rows="20" placeholder="Enter your title here" />

          <h6 class="mb-2">Category</h6>
          <v-select
              variant="solo"
              :items="categoryItems"
              item-title="name"
              item-value="id"
              return-object
              class="text-field-component"
              placeholder="Enter category"
              density="compact"
              v-model="category"
          >
          </v-select>
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
