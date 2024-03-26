<script lang="ts" setup>
import { ref } from "vue";
import { filter } from "@/components/products/utils";
import TopFilters from "@/components/products/TopFilters.vue";
import Listing from "@/components/products/Listing.vue";
import { FilterType } from "@/components/products/types";

const filters = ref<FilterType>(filter);
</script>
<template>
  <TopFilters class="mb-4" v-model="filters" />
  <Listing :filters="filters" />
</template>
