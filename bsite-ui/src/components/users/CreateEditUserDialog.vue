<script lang="ts" setup>
import { computed, ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { formateDate } from "@/app/common/dateFormate";
import TextArea from "@/app/common/validationComponents/TextArea.vue";

const emit = defineEmits(["update:modelValue", "onUpdate", "onCreate"]);

const refForm = ref<any>()
const showPassword = ref<boolean>(false)
const formRules = {
  required: [
    (v: any) => {
        return !!v || 'Value is required.'
      }
  ],
  requiredRule: [
    (v: any) => {
      return v.length > 0 || 'Value is required.'
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
    return
    // emit("onUpdate", {
    //   ...prop.itemDetail,
    //   username: username.value,
    //   email: email.value,
    // });
  } else {
    emit("onCreate", {
      username: username.value,
      password: password.value,
      roles: [roles.value],
      email: email.value
    });
  }
};

const username = ref(prop.itemDetail?.username || "");
const email = ref(prop.itemDetail?.email || "");
const roles = ref(prop.itemDetail?.roles);
const password = ref(prop.itemDetail?.password || "");
</script>
<template>
  <v-dialog v-model="dialogValue" width="600" scrollable>
    <v-form ref="refForm">
      <Card :title="!isCreate ? 'Edit user' : 'Add user'">
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
              <h6 class="mb-2">Username</h6>
              <v-text-field
                  variant="solo"
                  class="text-field-component"
                  density="compact"
                  v-model="username"
                  :rules="formRules.required"
                  placeholder="Enter username here"
              />
            </v-col>
            <v-col cols="12" md="6">
              <h6 class="mb-2">Email</h6>
              <v-text-field
                  variant="solo"
                  class="text-field-component"
                  density="compact"
                  v-model="email"
                  :rules="formRules.required"
                  placeholder="Enter email here"
              />
            </v-col>
          </v-row>
          <h6 class="mb-2">Password</h6>
          <v-text-field
              variant="solo"
              class="text-field-component"
              :type="showPassword ? 'text' : 'password'"
              density="compact"
              :rules="formRules.required"
              v-model="password"
              placeholder="Enter password here"
          >
            <template #append-inner>
              <v-btn icon density="compact" @click="showPassword = !showPassword">
                <v-icon>{{ showPassword ? 'mdi-eye-off' : 'mdi-eye'}}</v-icon>
              </v-btn>
            </template>
          </v-text-field>

          <h6 class="mb-2">Role</h6>
          <v-select
              variant="solo"
              :items="['admin', 'user']"
              class="text-field-component"
              density="compact"
              :rules="formRules.requiredRule"
              v-model="roles"
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
            {{ !isCreate ? "Update" : "Add User" }}
          </v-btn>
        </v-card-actions>
      </Card>
    </v-form>
  </v-dialog>
</template>
