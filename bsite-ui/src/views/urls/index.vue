<script lang="ts" setup>
import { productBreadcrumb } from "@/components/urls/utils";
import Urls from "@/components/urls/index.vue";
</script>
<template>
  <Breadcrumb title="Urls" :items="productBreadcrumb" />
  <Urls />
</template>
