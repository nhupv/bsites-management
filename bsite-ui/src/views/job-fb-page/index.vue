<script lang="ts" setup>
import { productBreadcrumb } from "@/components/job-fb-page/utils";
import JobPages from "@/components/job-fb-page/index.vue";
</script>
<template>
  <Breadcrumb title="Job Page" :items="productBreadcrumb" />
  <JobPages />
</template>
