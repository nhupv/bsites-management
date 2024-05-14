<script lang="ts" setup>
import {ref, onMounted, onUnmounted} from "vue";
import {handleError, handleErrorMsg} from "@/app/helpers";
import {httpService} from "@/app/http/httpServiceProvider";
import {useToast} from "vue-toast-notification";
import ConfirmationDialog from "@/app/common/components/ConfirmationDialog.vue";

const prop = defineProps({
  siteId: {
    type: String,
    default: '',
  },
  siteName: {
    type: String,
    default: 'Stats'
  }
});
const $toast = useToast({ position: 'top-right'});
const loading  = ref<boolean>(false);
const intervalID = ref<null | ReturnType<typeof setTimeout>>(null)
const error = ref('')
const dataStats = ref<any>([]);
const siteUrl = ref<any>('');
const note = ref<any>('');
const confirmationDialog = ref(false);


const getStats = async () => {
  loading.value = true;
  if(intervalID.value) {
    clearInterval(intervalID.value)
  }

  intervalID.value = setInterval(() => {
    getStats()
  },300000)

  try {
    const data = await httpService.get(`/sites/${prop.siteId}/dashboard/stats`)
    siteUrl.value = data.site_url
    note.value = data.note
    Object.keys(data).forEach(function(key, index) {
      if(typeof data[key] === 'number') {
        const updateField = dataStats.value.findIndex((field: any) => {
          return field.key === key
        } )
        if(updateField >= 0) {
          dataStats.value[updateField] = { title: key.split('_').join(' '), preCount: dataStats.value[updateField]?.count, count: Math.round(data[key] * 100) / 100, key }
        } else {
          dataStats.value.push({ title: key.split('_').join(' '), preCount: 0, count: Math.round(data[key] * 100) / 100, key });
        }
      }
    });
  } catch (e) {
    error.value = handleErrorMsg(e)
  } finally {
    loading.value = false;
  }
}

const resetStats = async () => {
  loading.value = true;
  confirmationDialog.value = false;
  try {
    const data = await httpService.get(`/sites/${prop.siteId}/dashboard/reset`)
    const message = typeof  data.message !== 'string' ? String(data.message) : data.message
    $toast.success(message)
    await getStats()
  } catch (e) {
    handleError(e)
  } finally {
    loading.value = false;
  }
}

onMounted(()=> {
  getStats()
})

onUnmounted(() => {
  if(intervalID.value) {
    clearInterval(intervalID.value)
  }
})
</script>
<template>
  <v-card>
    <v-card-title
        class="text-subtitle-1 font-weight-bold d-flex justify-space-between align-center"
    >
      <h4 class="text-body-1 font-weight-bold">
        {{ siteName }} | Run site: <a v-if="siteUrl" class="text-decoration-underline text-primary" :href="siteUrl" target="_blank">{{ siteUrl }}</a> <span class="text-primary" v-else>--</span>
        <span v-if="note"> | <span class="text-secondary">Note: {{note}}</span></span>
      </h4>
      <div>
        <v-btn
            :loading="loading"
            variant="outlined"
            elevation="0"
            class="my-2"
            @click="getStats"
        >
          <i class="ph-arrow-clockwise mx-1" /> Refresh
        </v-btn>
        <v-btn
            :loading="loading"
            variant="tonal"
            elevation="0"
            class="my-2 ml-4"
            @click="confirmationDialog = true"
        >
          <i class="ph-arrows-clockwise mx-1" /> Reset Stats
        </v-btn>
      </div>
    </v-card-title>
    <v-card-text class="text-error" v-if="error">
      {{ error }}
    </v-card-text>
    <v-card-text v-else>
      <v-row>
        <v-col
            cols="12"
            sm="6"
            lg="3"
            v-for="(item, index) in dataStats"
            :key="'real-estate-dashboard-' + index"
        >
          <v-card variant="tonal" color="primary">
            <v-card-text>
              <v-row no-gutters justify="space-between">
                <v-col cols>
                  <div class="d-flex flex-column h-100">
                    <div class="text-muted text-subtitle-2 font-weight-regular text-uppercase">
                      {{ item.title }}
                    </div>
                    <div class="mt-auto">
                      <span v-if="item.key === 'ctr'" class="text-h5 font-weight-bold mx-1">
                        {{item.count}}
                      </span>
                      <CountTo
                          v-else
                          class="text-h5 font-weight-bold mx-1"
                          :startVal="item.preCount"
                          :endVal="item.count"
                          :suffix="item.suffix"
                          :decimals="item.decimals"
                      />
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions v-if="note" class="px-0 pt-0 align-center" style="min-height: auto">
      <v-card-subtitle class="text-secondary pt-0 text-right text-body-2">
        Note: {{note}}
      </v-card-subtitle>
    </v-card-actions>
  </v-card>
  <ConfirmationDialog
      :title="`Reset Stats ${siteName}`"
      v-model="confirmationDialog"
      @onConfirm="resetStats"
  />
</template>
