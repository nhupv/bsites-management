<script lang="ts" setup>
import { computed, ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { formateDate } from "@/app/common/dateFormate";

const emit = defineEmits(["update:modelValue", "onUpdate", "onCreate"]);

const refForm = ref<any>()

const actives = [
  {
    text: 'Active',
    value: true
  },
  {
    text: 'Inactive',
    value: false
  }
]
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
      name: siteName.value,
      description: siteDescription.value,
      ip: siteIp.value,
      siteUrl: siteUrl.value,
      ctr: ctr.value,
      status: status.value,
    });
  } else {
    emit("onCreate", {
      name: siteName.value,
      description: siteDescription.value,
      ip: siteIp.value,
      siteUrl: siteUrl.value,
      ctr: ctr.value,
      status: status.value,
    });
  }
};

const siteName = ref(prop.itemDetail?.name || "");
const siteDescription = ref(prop.itemDetail?.description || "");
const siteUrl = ref(prop.itemDetail?.siteUrl || "");
const siteIp = ref(prop.itemDetail?.ip || "");
const ctr = ref(prop.itemDetail?.ctr);
const status = ref(prop.itemDetail?.status);
</script>
<template>
  <v-dialog v-model="dialogValue" width="600" scrollable>
    <v-form ref="refForm">
      <Card :title="!isCreate ? 'Edit Site' : 'Add Site'">
        <template #title-action>
          <v-btn
            variant="plain"
            icon="ph-x"
            size="small"
            @click="dialogValue = false"
          />
        </template>
        <v-card-text data-simplebar style="max-height: 500px">
          <v-row>
            <v-col cols="12" md="8">
              <h6 class="mb-2">Site name</h6>
              <v-text-field
                  variant="solo"
                  class="text-field-component"
                  density="compact"
                  v-model="siteName"
                  :rules="formRules.requiredRule"
                  placeholder="Enter site name"
              />
            </v-col>
            <v-col cols="12" md="4">
              <h6 class="mb-2">Status</h6>
              <v-select
                  variant="solo"
                  :items="actives"
                  item-value="value"
                  item-title="text"
                  class="text-field-component"
                  density="compact"
                  v-model="status"
              >
              </v-select>
            </v-col>
          </v-row>
            <h6 class="mb-2">Home url</h6>
            <v-text-field
                variant="solo"
                class="text-field-component"
                density="compact"
                v-model="siteUrl"
                :rules="formRules.requiredRule"
                placeholder="Enter home url"
            />
          <v-row>
            <v-col>
              <h6 class="mb-2">Ip</h6>
              <v-text-field
                  variant="solo"
                  class="text-field-component"
                  density="compact"
                  v-model="siteIp"
                  :rules="formRules.requiredRule"
                  placeholder="Enter ip"
              />
            </v-col>
            <v-col>
              <h6 class="mb-2">CTR</h6>
              <v-text-field
                  variant="solo"
                  type="number"
                  class="text-field-component"
                  density="compact"
                  v-model="ctr"
                  placeholder="Enter CTR"
              />
            </v-col>
          </v-row>
          <h6 class="mb-2">Description</h6>
          <v-text-field
              variant="solo"
              class="text-field-component"
              density="compact"
              v-model="siteDescription"
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
            {{ !isCreate ? "Update" : "Add Site" }}
          </v-btn>
        </v-card-actions>
      </Card>
    </v-form>
  </v-dialog>
</template>
