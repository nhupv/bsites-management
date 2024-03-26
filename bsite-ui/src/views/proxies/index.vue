<script lang="ts" setup>
import { productBreadcrumb } from "@/components/proxies/utils";
import Proxies from "@/components/proxies/index.vue";
</script>
<template>
  <Breadcrumb title="Proxies" :items="productBreadcrumb" />
  <Proxies />
</template>
