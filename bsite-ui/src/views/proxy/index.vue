<script lang="ts" setup>
import { productBreadcrumb } from "@/components/proxy/utils";
import Proxies from "@/components/proxy/index.vue";
</script>
<template>
  <Breadcrumb title="Proxy" :items="productBreadcrumb" />
  <Proxies />
</template>
