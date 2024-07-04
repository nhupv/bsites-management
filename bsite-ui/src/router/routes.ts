import { DefaultLayout, AuthLayout } from "@/layouts/index";
import ECommerceVue from "@/views/dashboard/ECommerce.vue";

const authPrefix = "/auth";
const pagesPrefix = "/pages";

const accountRoutes = [
  {
    path: `/signin`,
    name: "AccountSignIn",
    component: () => import("@/views/account/SignIn.vue"),
    meta: { title: "Sign In", authRequired: false }
  },
  {
    path: `/signup`,
    name: "AccountSignUp",
    component: () => import("@/views/account/SignUp.vue"),
    meta: { title: "Sign Up", authRequired: false }
  },
  // {
  //   path: `/pass-reset`,
  //   name: "AccountResetPassword",
  //   component: () => import("@/views/account/ResetPassword.vue"),
  //   meta: { title: "Reset Password", authRequired: false }
  // },
  // {
  //   path: `/pass-change`,
  //   name: "AccountChangePassword",
  //   component: () => import("@/views/account/CreatePassword.vue"),
  //   meta: { title: "Create New Password", authRequired: false }
  // }
].map((data) => {
  return {
    ...data,
    meta: { ...data.meta, layout: AuthLayout }
  };
});

const dashboardRoutes = [
  {
    path: "/",
    name: "ECommerce",
    component: ECommerceVue,
    meta: { title: "Dashboard", authRequired: true, layout: DefaultLayout }
  }
].map((data) => {
  return {
    ...data,
    meta: { ...data.meta, layout: DefaultLayout }
  };
});
const authRoutes = [
  {
    path: `${authPrefix}/signin`,
    name: "SignIn",
    component: () => import("@/views/authentication/SignIn.vue"),
    meta: { title: "Sign In", authRequired: false }
  },
  {
    path: `${authPrefix}/signup`,
    name: "SignUp",
    component: () => import("@/views/authentication/SignUp.vue"),
    meta: { title: "Sign Up", authRequired: false }
  },
  // {
  //   path: `${authPrefix}/pass-reset`,
  //   name: "ResetPassword",
  //   component: () => import("@/views/authentication/ResetPassword.vue"),
  //   meta: { title: "Reset Password", authRequired: false }
  // },
  // {
  //   path: `${authPrefix}/pass-change`,
  //   name: "ChangePassword",
  //   component: () => import("@/views/authentication/CreatePassword.vue"),
  //   meta: { title: "Create New Password", authRequired: false }
  // },
  // {
  //   path: `${authPrefix}/lockscreen`,
  //   name: "LockScreen",
  //   component: () => import("@/views/authentication/LockScreen.vue"),
  //   meta: { title: "Lock Screen", authRequired: false }
  // },
  {
    path: `${authPrefix}/logout`,
    name: "LogOut",
    component: () => import("@/views/authentication/Logout.vue"),
    meta: { title: "Log Out", authRequired: false }
  },
  // {
  //   path: `${authPrefix}/success-msg`,
  //   name: "SuccessMessage",
  //   component: () => import("@/views/authentication/SuccessMsg.vue"),
  //   meta: { title: "Success Message", authRequired: false }
  // },
  // {
  //   path: `${authPrefix}/twostep`,
  //   name: "TwoStepVerification",
  //   component: () => import("@/views/authentication/TwoStepVerification.vue"),
  //   meta: { title: "Two Step Verification", authRequired: false }
  // },
  {
    path: `${authPrefix}/404`,
    name: "Error404",
    component: () => import("@/views/authentication/error/404.vue"),
    meta: { title: "404 Error", authRequired: false }
  },
  // {
  //   path: `${authPrefix}/500`,
  //   name: "Error500",
  //   component: () => import("@/views/authentication/error/500.vue"),
  //   meta: { title: "500 Error", authRequired: false }
  // },
  // {
  //   path: `${authPrefix}/503`,
  //   name: "Error503",
  //   component: () => import("@/views/authentication/error/503.vue"),
  //   meta: { title: "503 Error", authRequired: false }
  // },
  // {
  //   path: `${authPrefix}/offline`,
  //   name: "Offline",
  //   component: () => import("@/views/authentication/error/Offline.vue"),
  //   meta: { title: "Offline Page", authRequired: false }
  // }
].map((data) => {
  return {
    ...data,
    meta: { ...data.meta, layout: AuthLayout }
  };
});
const pagesRoutes = [
  {
    path: `${pagesPrefix}/starter`,
    name: "Starter",
    component: () => import("@/views/pages/StarterKit.vue"),
    meta: { title: "Starter", authRequired: false, layout: DefaultLayout }
  },
  {
    path: `${pagesPrefix}/maintenance`,
    name: "PagesMaintenance",
    component: () => import("@/views/pages/Maintenance.vue"),
    meta: { title: "Maintenance", authRequired: false, layout: AuthLayout }
  },
  {
    path: `${pagesPrefix}/coming-soon`,
    name: "PagesComingSoon",
    component: () => import("@/views/pages/ComingSoon.vue"),
    meta: { title: "Coming Soon", authRequired: false, layout: AuthLayout }
  }
];

export const routes = [
  ...accountRoutes,
  // ...dashboardRoutes,
  {
    path: "/",
    name: "Home",
    redirect: '/dashboard',
    // component: () => import("@/views/site/index.vue"),
    meta: { title: "Home", authRequired: true, layout: DefaultLayout },
  },
  {
    path: "/sites",
    name: "Site",
    component: () => import("@/views/site/index.vue"),
    meta: { title: "Site", authRequired: true, layout: DefaultLayout },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("@/views/dashboard/GeneralStats.vue"),
    meta: { title: "Dashboard", authRequired: true, layout: DefaultLayout },
  },
  {
    path: "/site-stats",
    name: "Site Stats",
    component: () => import("@/views/dashboard/SiteStats.vue"),
    meta: { title: "Site Stats", authRequired: true, layout: DefaultLayout },
  },
  {
    path: "/users",
    name: "User",
    component: () => import("@/views/user/index.vue"),
    meta: { title: "Site", authRequired: true, layout: DefaultLayout },
  },
  {
    path: "/bots",
    name: "Bots",
    component: () => import("@/views/bots/index.vue"),
    meta: { title: "Bots", authRequired: true, layout: DefaultLayout },
  },
  {
    path: "/urls",
    name: "Urls",
    component: () => import("@/views/urls/index.vue"),
    meta: { title: "Urls", authRequired: true, layout: DefaultLayout },
  },
  {
    path: "/proxy",
    name: "Proxy",
    component: () => import("@/views/proxy/index.vue"),
    meta: { title: "Proxy", authRequired: true, layout: DefaultLayout },
  },
  {
    path: "/fb-page",
    name: "Fb Page",
    component: () => import("@/views/fb-page/index.vue"),
    meta: { title: "FB Page", authRequired: true, layout: DefaultLayout },
  },
  // {
  //   path: "/proxies",
  //   name: "Proxies",
  //   component: () => import("@/views/proxies/index.vue"),
  //   meta: { title: "Proxies", authRequired: true, layout: DefaultLayout },
  // },
  {
    path: "/keywords",
    name: "Keywords",
    component: () => import("@/views/keywords/index.vue"),
    meta: { title: "Keywords", authRequired: true, layout: DefaultLayout },
  },
  {
    path: "/posts",
    name: "Posts",
    component: () => import("@/views/posts/index.vue"),
    meta: { title: "Posts", authRequired: true, layout: DefaultLayout },
  },
  ...authRoutes,
  // ...pagesRoutes,
  {
    path: "/logout",
    name: "Logout",
    component: () => import("@/views/account/Logout.vue"),
    meta: { title: "Logout", authRequired: false }
  }
];
