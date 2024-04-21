<script lang="ts" setup>
import { realEstateBreadcrumb } from "@/components/dashboard/utils";
import Dashboard from "@/components/dashboard/Dashboard.vue";
</script>
<template>
  <Breadcrumb title="Site Statistics" :items="realEstateBreadcrumb" />
  <Dashboard />
<!--  <v-row>-->
<!--    <v-col cols="12" lg="4">-->
<!--      <PropertyType />-->
<!--    </v-col>-->
<!--    <v-col cols="12" lg="8">-->
<!--      <RevenueOverview />-->
<!--    </v-col>-->
<!--  </v-row>-->
</template>
