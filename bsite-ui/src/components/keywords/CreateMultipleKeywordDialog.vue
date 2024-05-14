<script lang="ts" setup>
import { computed, ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { formateDate } from "@/app/common/dateFormate";
import TextArea from "@/app/common/validationComponents/TextArea.vue";

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
      description: description.value,
      keyword: keyword.value,
    });
  } else {
    emit("onCreate", {
      description: description.value,
      keywords: keywords.value,
    });
  }
};

const description = ref(prop.itemDetail?.description || "");
const keyword = ref(prop.itemDetail?.keyword || "");
const keywords = ref<string>('');
</script>
<template>
  <v-dialog v-model="dialogValue" width="600" scrollable>
    <v-form ref="refForm">
      <Card :title="!isCreate ? 'Edit Keyword' : 'Add Keyword'">
        <template #title-action>
          <v-btn
            variant="plain"
            icon="ph-x"
            size="small"
            @click="dialogValue = false"
          />
        </template>
        <v-card-text data-simplebar style="max-height: 500px">
          <h6 class="mb-2">Keywords</h6>
          <v-text-field
              v-if="!isCreate"
              variant="solo"
              class="text-field-component"
              density="compact"
              v-model="keyword"
              :rules="formRules.requiredRule"
              placeholder="Enter keyword here"
          />
          <TextArea v-else v-model="keywords"
                    :rules="formRules.requiredRule"
                    rows="20" placeholder="Paste your keywords here" />
          <h6 class="mb-2">Description</h6>
          <v-text-field
              variant="solo"
              class="text-field-component"
              density="compact"
              v-model="description"
              placeholder="Enter description"
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
            class=""
            color="primary"
            variant="elevated"
            elevation="0"
            @click="onCreateUpdate"
          >
            {{ !isCreate ? "Update" : "Add Keyword" }}
          </v-btn>
        </v-card-actions>
      </Card>
    </v-form>
  </v-dialog>
</template>
