<script lang="ts" setup>
import { productBreadcrumb } from "@/components/fb-page/utils";
import Sites from "@/components/fb-page/index.vue";
</script>
<template>
  <Breadcrumb title="FB Page" :items="productBreadcrumb" />
  <Sites />
</template>
