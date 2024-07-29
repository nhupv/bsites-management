<script lang="ts" setup>
import { computed, ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { formateDate } from "@/app/common/dateFormate";
import {format, getUnixTime} from "date-fns";

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
      via_name: via_name.value,
      page_name: page_name.value,
      page_id: page_id.value,
      expired_date: expired_date.value,
      url: url.value,
      access_token: access_token.value,
    });
  } else {
    emit("onCreate", {
      via_name: via_name.value,
      page_name: page_name.value,
      page_id: page_id.value,
      expired_date: expired_date.value,
      url: url.value,
      access_token: access_token.value,
    });
  }
};

const via_name = ref(prop.itemDetail?.via_name || "");
const page_name = ref(prop.itemDetail?.page_name || "");
const page_id = ref(prop.itemDetail?.page_id || "");
const url = ref(prop.itemDetail?.url || "");
const expired_date = ref(prop.itemDetail?.expired_date);
const access_token = ref(prop.itemDetail?.access_token);
const showPass = ref(false);
</script>
<template>
  <v-dialog v-model="dialogValue" width="600" scrollable>
    <v-form ref="refForm">
      <Card :title="!isCreate ? 'Edit Page' : 'Add Page'">
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
            <v-col cols="12" md="6">
              <h6 class="mb-2">Via name</h6>
              <v-text-field
                  variant="solo"
                  class="text-field-component"
                  density="compact"
                  v-model="via_name"
                  :rules="formRules.requiredRule"
                  placeholder="Enter via name"
              />
            </v-col>
            <v-col cols="12" md="6">
              <h6 class="mb-2">Page id</h6>
              <v-text-field
                  variant="solo"
                  class="text-field-component"
                  density="compact"
                  v-model="page_id"
                  :rules="formRules.requiredRule"
                  placeholder="Enter page id"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <h6 class="mb-2">Page name</h6>
              <v-text-field
                  variant="solo"
                  class="text-field-component"
                  density="compact"
                  v-model="page_name"
                  :rules="formRules.requiredRule"
                  placeholder="Enter page name"
              />
            </v-col>
            <v-col>
              <h6 class="mb-2">Page url</h6>
              <v-text-field
                  variant="solo"
                  class="text-field-component"
                  density="compact"
                  v-model="url"
                  placeholder="Enter page url"
              />
            </v-col>
          </v-row>
           <v-row>
             <v-col>
               <h6 class="mb-2">Page access token</h6>
               <v-text-field
                   variant="solo"
                   :type="showPass ? 'text' : 'password'"
                   class="text-field-component"
                   density="compact"
                   :rules="formRules.requiredRule"
                   v-model="access_token"
                   hide-details="auto"
                   placeholder="Enter page access token"

               >
                 <template #append-inner>
                   <v-btn icon size="small" variant="text" @click="showPass = !showPass">
                     <v-icon>{{showPass ? 'mdi-eye-off' : 'mdi-eye'}}</v-icon>
                   </v-btn>
                 </template>
               </v-text-field>
             </v-col>
           </v-row>
          <v-row>
            <v-col cols="12">
              <h6 class="mb-2">Expired Date</h6>
              <v-text-field
                  variant="solo"
                  type="number"
                  class="text-field-component"
                  density="compact"
                  :rules="formRules.requiredRule"
                  v-model="expired_date"
                  hide-details="auto"
                  placeholder="Enter expired date"
              />
            </v-col>
            <v-col v-if="expired_date" cols="12">
              <VueDatePicker
                  :model-value="new Date(expired_date*1000)"
                  :min-date="new Date()"
                  :teleport="true"
                  :clearable="false"
                  readonly
                  auto-apply
                  :format="(date: Date) => format(date, 'LLLL dd, yyyy HH:mm')"
                  :enable-time-picker="false"
              />
            </v-col>
          </v-row>
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
            {{ !isCreate ? "Update" : "Add Page" }}
          </v-btn>
        </v-card-actions>
      </Card>
    </v-form>
  </v-dialog>
</template>
