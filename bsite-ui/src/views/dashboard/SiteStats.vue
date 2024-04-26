<script lang="ts" setup>
import { realEstateBreadcrumb } from "@/components/dashboard/utils";
import Dashboard from "@/components/dashboard/Dashboard.vue";
import StatsLineChart from "@/components/dashboard/StatsLineChart.vue";
import BotHistory from "@/components/dashboard/BotHistory.vue";
</script>
<template>
  <Breadcrumb title="Site Statistics" :items="realEstateBreadcrumb" />
  <v-row>
    <v-col cols="12">
      <Dashboard />
    </v-col>
    <v-col cols="12">
      <StatsLineChart />
    </v-col>
    <v-col cols="12">
      <BotHistory />
    </v-col>
  </v-row>
</template>
