<script lang="ts" setup>
import {computed, onMounted, ref, watch} from "vue";
import ImageUploader from "@/app/common/components/ImageUploader.vue";
import PageSelectedComponent from "@/components/job-fb-page/PageSelectedComponent.vue";
const emit = defineEmits(["update:modelValue", "onUpdate", "onCreate"]);

const refForm = ref<any>()
const pageList = ref([])
const pageSelected = ref([])
const pageIdSelected = defineModel<Array<any>>('pageIdSelected')
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

const onCreateUpdate = async () => {

  const { valid } = await refForm.value?.validate()
  if(!valid) return
  emit("onCreate", {
    url: url.value,
    caption_prompt: captionPrompt.value,
    image: image.value,
    pages: pageSelected.value,
  });
}

const onChangePage = ( pages: any) => {
  pageSelected.value = pages
}

const url = ref(prop.itemDetail?.url || "");
const image = ref();
const captionPrompt = ref(prop.itemDetail?.captionPrompt || "");
</script>
<template>
  <v-dialog v-model="dialogValue" max-width="800" scrollable>
    <v-form ref="refForm">
    <Card :title="'Create Post'">
        <template #title-action>
          <v-btn
            variant="plain"
            icon="ph-x"
            size="small"
            @click="dialogValue = false"
          />
        </template>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <h6 class="mb-2">Url</h6>
                <v-textarea
                    variant="solo"
                    class="text-field-component"
                    density="compact"
                    rows="2"
                    v-model="url"
                    :rules="formRules.requiredRule"
                    placeholder="Enter url here"
                />
              </v-col>
              <v-col cols="12" md="6">
                <h6 class="mb-2">Caption prompt</h6>
                <v-textarea
                    variant="solo"
                    class="text-field-component"
                    density="compact"
                    rows="2"
                    v-model="captionPrompt"
                    :rules="formRules.requiredRule"
                    placeholder="Enter caption prompt here"
                />
              </v-col>
              <v-col cols="12">
                <h6 class="mb-2">Image</h6>
                <ImageUploader :multiple="false" v-model="image" :rules="formRules.requiredRule" />
              </v-col>
            </v-row>
              <PageSelectedComponent @on-change="onChangePage" />
              <v-row>
                <v-col cols="12">
                </v-col>
              </v-row>
          </v-card-text>
          <v-card-actions>
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
                :disabled="pageSelected.length === 0"
                color="primary"
                variant="elevated"
                elevation="0"
                @click="onCreateUpdate"

            >
              {{ "Post to page" }}
            </v-btn>
          </v-card-actions>
      </Card>
    </v-form>
  </v-dialog>
</template>
