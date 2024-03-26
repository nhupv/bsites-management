<script lang="ts" setup>
import { productBreadcrumb } from "@/components/users/utils";
import Users from "@/components/users/index.vue";
</script>
<template>
  <Breadcrumb title="Users" :items="productBreadcrumb" />
  <Users />
</template>
