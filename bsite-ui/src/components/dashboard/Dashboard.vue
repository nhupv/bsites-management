<script lang="ts" setup>
import { getChartColorsArray } from "@/app/common/chartColorArray";
import {ref, watch, computed, onMounted} from "vue";
import { getCharts } from "@/components/dashboard/utils";
import { useLayoutStore } from "@/store/app";
import {handleError} from "@/app/helpers";
import {httpService} from "@/app/http/httpServiceProvider";
import {useSite} from "@/store/site";
import {useToast} from "vue-toast-notification";

const $toast = useToast({ position: 'top-right'});
const siteStore = useSite()
const siteId = computed(()=> siteStore.siteId)
const loading  = ref<boolean>(false);

const dataStats = ref<any>([]);

const getStats = async () => {
  dataStats.value = []
  loading.value = true;
  try {
    const data = await httpService.get(`/sites/${siteId.value}/dashboard/stats`)
    Object.keys(data).forEach(function(key, index) {
      if(typeof data[key] === 'number')
      dataStats.value.push({ title: key.split('_').join(' '), count: data[key] });
    });
  } catch (e) {
    handleError(e)
  } finally {
    loading.value = false;
  }
}

const resetStats = async () => {
  loading.value = true;
  try {
    const data = await httpService.get(`/sites/${siteId.value}/dashboard/reset`)
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

// const state = useLayoutStore();
// const layoutTheme = computed(() => state.layoutTheme);

// watch(layoutTheme, () => {
//   data.value = [];
//   setTimeout(() => {
//     const chartsVal = getCharts(getChartColorsArray);
//     data.value = chartsVal.data;
//   }, 200);
// });
</script>
<template>
  <v-card>
    <v-card-title
        class="text-subtitle-1 font-weight-bold d-flex justify-space-between align-center"
    >
      <h4 class="text-body-1 font-weight-bold">
        Dashboard
      </h4>
      <div>
        <v-btn
            :loading="loading"
            variant="outlined"
            elevation="0"
            class="my-2 mr-4"
            @click="getStats"
        >
          <i class="ph-arrow-clockwise mx-1" /> Refresh
        </v-btn>
        <v-btn
            :loading="loading"
            variant="tonal"
            elevation="0"
            class="my-2"
            @click="resetStats"
        >
          <i class="ph-arrows-clockwise mx-1" /> Reset Stats
        </v-btn>
      </div>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col v-if="loading" cols="12">
          <v-progress-linear
              indeterminate
              height="2"
          ></v-progress-linear>
        </v-col>
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
                      <CountTo
                          class="text-h5 font-weight-bold mx-1"
                          :endVal="item.count"
                          :suffix="item.suffix"
                          :decimals="item.decimals"
                      />
                      <!--                  <span-->
                      <!--                    class="font-weight-bold"-->
                      <!--                    :class="item.isSuccess ? 'text-success' : 'text-danger'"-->
                      <!--                  >-->
                      <!--                    <i v-if="item.isSuccess" class="ph-arrow-up"></i>-->
                      <!--                    <i v-else class="ph-arrow-down"></i>-->
                      <!--                    {{ item.percent }}-->
                      <!--                  </span>-->
                    </div>
                  </div>
                </v-col>
                <!--            <v-col class="d-flex justify-end">-->
                <!--              <div class="temp-class">-->
                <!--                <apexchart-->
                <!--                  v-if="item.chart"-->
                <!--                  class="apex-charts"-->
                <!--                  height="110"-->
                <!--                  width="110"-->
                <!--                  dir="ltr"-->
                <!--                  :series="item.chart.series"-->
                <!--                  :options="item.chart.chartOptions"-->
                <!--                />-->
                <!--              </div>-->
                <!--            </v-col>-->
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>

  </v-card>
</template>
