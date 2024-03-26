<script lang="ts" setup>
import { productBreadcrumb } from "@/components/products/utils";
import Sites from "@/components/sites/index.vue";
</script>
<template>
  <Breadcrumb title="Sites" :items="productBreadcrumb" />
  <Sites />
</template>
