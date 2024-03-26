<script lang="ts" setup>
import { computed, ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { formateDate } from "@/app/common/dateFormate";

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
      description: urlDescription.value,
      url: url.value,
    });
  } else {
    emit("onCreate", {
      description: urlDescription.value,
      url: url.value,
    });
  }
};

const urlDescription = ref(prop.itemDetail?.description || "");
const url = ref(prop.itemDetail?.url || "");
</script>
<template>
  <v-dialog v-model="dialogValue" width="600" scrollable>
    <v-form ref="refForm">
      <Card :title="!isCreate ? 'Edit Bot' : 'Add Bot'">
        <template #title-action>
          <v-btn
            variant="plain"
            icon="ph-x"
            size="small"
            @click="dialogValue = false"
          />
        </template>
        <v-card-text data-simplebar style="max-height: 500px">
          <h6 class="mb-2">Url</h6>
          <v-text-field
              variant="solo"
              class="text-field-component"
              density="compact"
              v-model="url"
              :rules="formRules.requiredRule"
              placeholder="Enter home url"
          />
              <h6 class="mb-2">Description</h6>
              <v-text-field
                  variant="solo"
                  class="text-field-component"
                  density="compact"
                  v-model="urlDescription"
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
            {{ !isCreate ? "Update" : "Add Bot" }}
          </v-btn>
        </v-card-actions>
      </Card>
    </v-form>
  </v-dialog>
</template>
