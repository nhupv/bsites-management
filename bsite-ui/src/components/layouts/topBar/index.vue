<script lang="ts" setup>
import BrandList from "@/components/layouts/topBar/BrandList.vue";
import LanguageDropDown from "@/components/layouts/topBar/LanguageDropDown.vue";
import Cart from "@/components/layouts/topBar/Cart.vue";
import SiteMode from "@/components/layouts/topBar/SiteMode.vue";
import ScreenSize from "@/components/layouts/topBar/ScreenSize.vue";
import Notifications from "@/components/layouts/topBar/Notifications.vue";
import Profile from "@/components/layouts/topBar/Profile.vue";
import MenuComponents from "@/components/layouts/topBar/MenuComponent.vue";
import MobileMenuComponent from "@/components/layouts/topBar/MobileMenuComponent.vue";

import { useLayoutStore } from "@/store/app";
import {SIDEBAR_SIZE, LAYOUTS, LAYOUT_POSITION, LS_KEY_SITE} from "@/app/const";
import {onMounted, onUnmounted, computed, ref, watch} from "vue";
import {categoryOptions} from "@/components/products/utils";
import MenuSelect from "@/app/common/components/filters/MenuSelect.vue";
import {useSite} from "@/store/site";

const { SMALL, DEFAULT } = SIDEBAR_SIZE;

const siteStore = useSite()

const siteList = computed(()=> siteStore.sites)

const siteSelected = computed({
  get() {
    return siteStore.siteId;
  },
  set(siteId: string) {
    localStorage.setItem(LS_KEY_SITE, siteId)
    siteStore.siteId = siteId
    // window.location.reload()
  },
});

const state = useLayoutStore();
const isSmallMenuActive = ref(false);

const isSmallSideBar = computed(() => {
  return state.sideBarSize === SMALL;
});

const isHorizontal = computed(() => {
  return state.layoutType === LAYOUTS.HORIZONTAL;
});

const isScrollableLayout = computed(() => {
  return state.position === LAYOUT_POSITION.SCROLLABLE;
});

onMounted(() => {
  addEventListeners();
  siteStore.getSites()
});

watch(() => siteStore.siteId, ()=> {
  window.location.reload()
})

const topBarScrollEvent = () => {
  var pageTopBar = document.getElementById("page-topbar");
  if (pageTopBar && !isScrollableLayout.value) {
    document.body.scrollTop >= 50 || document.documentElement.scrollTop >= 50
      ? pageTopBar.classList.add("topbar-shadow")
      : pageTopBar.classList.remove("topbar-shadow");
  }
};

const addEventListeners = () => {
  document.addEventListener("scroll", topBarScrollEvent);
};

const onDrawerClick = () => {
  if (isHorizontal.value) {
    isSmallMenuActive.value = !isSmallMenuActive.value;
  }
  const sideBarSize = state.sideBarSize;
  if (sideBarSize === SMALL) {
    state.changeSideBarSize(DEFAULT);
  } else {
    state.changeSideBarSize(SMALL);
  }
};

onUnmounted(() => {
  document.removeEventListener("scroll", topBarScrollEvent);
});
</script>
<template>
  <v-app-bar
    :scroll-behavior="isScrollableLayout ? 'hide elevate' : 'elevate'"
    id="page-topbar"
    height="70"
  >
    <v-container class="layout-width" fluid>
      <div class="navbar-header">
        <div class="d-flex align-center">
          <div class="navbar-brand-box horizontal-logo">
            <router-link to="/" class="logo logo-dark">
              <span class="logo-sm">
                <img src="@/assets/images/logo-sm.png" alt="" height="22" />
              </span>
              <span class="logo-lg">
                <img src="@/assets/images/logo-dark.png" alt="" height="22" />
              </span>
            </router-link>

            <router-link to="/" class="logo logo-light">
              <span class="logo-sm">
                <img src="@/assets/images/logo-sm.png" alt="" height="22" />
              </span>
              <span class="logo-lg">
                <img src="@/assets/images/logo-light.png" alt="" height="22" />
              </span>
            </router-link>
          </div>
          <v-app-bar-nav-icon
            variant="text"
            class="me-1 topnav-hamburger"
            @click="onDrawerClick"
          >
            <div id="topnav-hamburger-icon" class="d-flex align-center">
              <span
                class="hamburger-icon"
                :class="isSmallSideBar ? 'open' : ''"
              >
                <span></span>
                <span></span>
                <span></span>
              </span>
            </div>
          </v-app-bar-nav-icon>
          <div class="app-search">
            <v-select
                v-model="siteSelected"
                variant="solo"
                :items="siteList"
                item-title="name"
                item-value="_id"
                density="compact"
                hide-details
                class="menu-select-filter"
            >
                <template #prepend-inner>
                  <i class="mdi mdi-domain search-widget-icon" />
                </template>
            </v-select>
          </div>
        </div>
        <div class="d-flex align-center">
          <div class="dropdown topbar-head-dropdown ms-1 header-item">
            <BrandList />
<!--            <LanguageDropDown />-->
<!--            <Cart />-->
            <ScreenSize />
<!--            <SiteMode />-->
<!--            <Notifications />-->
            <Profile />
          </div>
        </div>
      </div>
      <div
        v-if="isHorizontal && $vuetify.display.mdAndUp"
        class="navbar-menu-horizontal"
      >
        <v-divider class="topbar-divider" />
        <MenuComponents />
      </div>

      <MobileMenuComponent
        v-if="isHorizontal && isSmallMenuActive && $vuetify.display.smAndDown"
      />
    </v-container>
  </v-app-bar>
</template>
