<script lang="ts" setup>
import {
  Avatar1,
  Avatar2,
  Avatar3,
  Avatar4,
  Avatar5,
} from "@/assets/images/users/utils";
</script>
<template>
  <v-card color="secondary" class="text-center auth-card">
    <v-card-title class="mt-10">
      <div class="font-weight-bold text-h6">Start your journey with us.</div>
      <div class="text-caption mt-1 font-weight-regular text-white opacity-75">
        It brings together your sites, proxies, keywords, urls and more
      </div>
    </v-card-title>
    <v-card-text>
      <div class="auth-effect-main rounded-circle mx-auto my-10">
        <div class="effect-circle-1 rounded-circle">
          <div class="effect-circle-2 rounded-circle">
            <div class="effect-circle-3 rounded-circle text-white">
              <span class="text-h6 me-2">Welcome</span>
              <span class="text-primary text-h6">Administrator</span>
            </div>
          </div>
        </div>
        <div class="auth-user-list">

          <v-avatar class="login-avatar" size="50">
            <v-icon
                size="x-large"
                color="white"
                icon="mdi-domain"
            ></v-icon>
          </v-avatar>
          <v-avatar class="login-avatar" size="50">
            <v-icon
                size="x-large"
                color="white"
                icon="mdi-account-group"
            ></v-icon>
          </v-avatar>
          <v-avatar class="login-avatar" size="50">
            <v-icon
                size="x-large"
                color="white"
                icon="mdi-web-box"
            ></v-icon>
          </v-avatar>
          <v-avatar class="login-avatar" size="50">
            <v-icon
                size="x-large"
                color="white"
                icon="mdi-application-outline"
            ></v-icon>
          </v-avatar>
          <v-avatar class="login-avatar" size="50">
            <v-icon
                size="x-large"
                color="white"
                icon="mdi-link"
            ></v-icon>
          </v-avatar>
        </div>
      </div>
    </v-card-text>
<!--    <v-card-actions class="pb-10 justify-center auth-banner-action">-->
<!--      <p class="text-white opacity-75 text-caption font-weight-regular">-->
<!--        &copy; {{ new Date().getFullYear() }} Steex. Crafted with-->
<!--        <i class="mdi mdi-heart text-danger"></i>-->
<!--        by Themesbrand-->
<!--      </p>-->
<!--    </v-card-actions>-->
  </v-card>
</template>
