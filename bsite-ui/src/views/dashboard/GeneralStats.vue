<script lang="ts" setup>
import { dashboardBreadcrumb } from "@/components/dashboard/utils";
import Dashboard from "@/components/dashboard/SiteStatsBlock.vue";
import {computed} from "vue";
import {useSite} from "@/store/site";
const siteStore = useSite()
const siteList = computed(()=> siteStore.sites)
</script>
<template>
  <Breadcrumb title="Dashboard" :items="dashboardBreadcrumb" />
  <v-row>
    <v-col v-for="site in siteList" :key="site._id" cols="12">
      <Dashboard :site-name="site.name" :site-id="site._id" :ctr="site.ctr" />
    </v-col>
  </v-row>
</template>
