<script lang="ts" setup>
import {ref, computed, watch, onMounted} from "vue";
import { getChartColorsArray } from "@/app/common/chartColorArray";
import {chartFilter, getCharts} from "@/components/dashboard/stats/utils";
import {httpService} from "@/app/http/httpServiceProvider";
import {handleError} from "@/app/helpers";
import {useSite} from "@/store/site";
import {format} from "date-fns";
import {aw} from "@/assets/images/flags/utils";

const siteStore = useSite()
const siteId = computed(()=> siteStore.siteId)
const charts = ref<any>(getCharts(getChartColorsArray));
const balanceOverviewChart = ref(charts.value.balanceOverviewChart);
const overviewType = ref(0);
const btnList = ref(chartFilter);
const dataStats = ref<any>([]);
const loading  = ref<boolean>(true);
const chartType = ref('ctr');

const getStats = async () => {
  loading.value = true;
  const filter = chartFilter[overviewType.value]
  try {
    const data = await httpService.post(`/sites/${siteId.value}/dashboard/stats-chart`, filter)
    const tempData =  data.reduce((result: any, row: any) => {
      return [
        {...result[0], data: [...result[0].data, row[chartType.value]], categories: [...result[0].categories, format(row.time, 'dd LLL HH:mm')]},
        // {...result[1], data: [...result[1].data, row.total_click_ads]},
        // {...result[2], data: [...result[2].data, row.total_views]},
      ]
    }, [{
      name: chartType.value,
      data: [],
      categories: [],
    }])
    balanceOverviewChart.value.series = tempData
    balanceOverviewChart.value.chartOptions.xaxis.categories = tempData[0].categories

    dataStats.value = tempData
  } catch (e) {
    handleError(e)
  } finally {
    loading.value = false;
  }
}

const overViewChange = (index: number) => {
  overviewType.value = index
  getStats()
}

// const dataChart = computed(() => {
//   return dataStats.value.reduce((result: any, row: any) => {
//     return [
//        {...result[0], data: [...result[0].data, row[chartType.value]], categories: [...result[0].categories, format(row.time, 'MM-dd-yyyy HH:mm')]},
//        // {...result[1], data: [...result[1].data, row.total_click_ads]},
//        // {...result[2], data: [...result[2].data, row.total_views]},
//     ]
//   }, [{
//        name: chartType.value,
//         color: "primary",
//        data: [],
//        categories: [],
//     }])
// })

// watch(dataChart, (value) => {
//   console.log(value)
//   balanceOverviewChart.value.series = value
//   balanceOverviewChart.value.chartOptions.xaxis.categories = value[0].categories
// })

const onChangeType = (v: any) => {
  chartType.value = v;
  getStats()
}

onMounted(async () => {
  await getStats()
})

</script>
<template>
  <Card :title="`${chartType}`" class="h-100">
    <template #title-action>
      <div class="d-flex align-center">
        <ListMenu :listItems="['ctr', 'total_click_ads', 'total_views']" @on-change="onChangeType" />
        <v-btn-toggle
            v-model="overviewType"
            color="primary"
            variant="tonal"
            :height="27"
        >
          <v-btn
              size="x-small"
              class="me-1"
              height="27"
              max-height="27"
              rounded
              v-for="(btn, index) in btnList"
              :key="btn.title"
              @click="overViewChange(index)"
          >
            {{ btn.title }}
          </v-btn>
        </v-btn-toggle>
      </div>
    </template>
    <v-card-text>
      <apexchart
          v-if="dataStats.length > 0"
        class="apex-charts"
        height="310"
        dir="ltr"
        :series="balanceOverviewChart.series"
        :options="balanceOverviewChart.chartOptions"
      />
      <v-container class="py-0">
        <v-row
          v-for="(overview, index) in dataStats"
          :key="'balance-overview-' + index"
          no-gutters
          class="py-1"
        >
          <v-col cols="12" md="4">
            <i class="bx bxs-square me-1" :class="'text-primary'"></i>
            <span class="text-capitalize">{{ overview.name }}</span>
          </v-col>
<!--          <v-col cols class="text-center font-weight-bold">-->
<!--            {{ overview.price }}-->
<!--          </v-col>-->
<!--          <v-col cols class="text-center">-->
<!--            <span :class="overview.isSuccess ? 'text-success' : 'text-danger'"-->
<!--              ><i v-if="overview.isSuccess" class="bx bxs-up-arrow"></i>-->
<!--              <i v-else class="bx bxs-down-arrow"></i>-->
<!--              <span class="px-1">{{ overview.percent }}</span>-->
<!--            </span>-->

<!--            than last years-->
<!--          </v-col>-->
<!--          <v-col cols class="balance-overview-view-btn">-->
<!--            <v-btn variant="text" density="compact" color="primary">-->
<!--              View All <i class="ph-arrow-right"></i>-->
<!--            </v-btn>-->
<!--          </v-col>-->
        </v-row>
      </v-container>
    </v-card-text>
  </Card>
</template>
<style>
.v-btn-group--density-default.v-btn-group {
  height: 27px;
}
</style>