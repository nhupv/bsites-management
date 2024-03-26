<script lang="ts" setup>
import { productBreadcrumb } from "@/components/keywords/utils";
import Keywords from "@/components/keywords/index.vue";
</script>
<template>
  <Breadcrumb title="Keywords" :items="productBreadcrumb" />
  <Keywords />
</template>
