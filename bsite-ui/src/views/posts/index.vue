<script lang="ts" setup>
import { productBreadcrumb } from "@/components/posts/utils";
import Posts from "@/components/posts/index.vue";
</script>
<template>
  <Breadcrumb title="Posts" :items="productBreadcrumb" />
  <Posts />
</template>
