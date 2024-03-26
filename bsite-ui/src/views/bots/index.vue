<script lang="ts" setup>
import { productBreadcrumb } from "@/components/bots/utils";
import Bots from "@/components/bots/index.vue";
</script>
<template>
  <Breadcrumb title="Bots" :items="productBreadcrumb" />
  <Bots />
</template>
