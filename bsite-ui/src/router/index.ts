import { createRouter, createWebHistory } from "vue-router";
import { routes } from "@/router/routes";
import { fakeBackendService, authService } from "@/app/http/httpServiceProvider";
import { useRouter } from "vue-router";
import LocalStorage from "@/app/localStorage";
import {LS_KEY_TOKEN} from "@/app/const";

const tokenLocalStorage = new LocalStorage(LS_KEY_TOKEN);

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const title = "Bot website management";

router.beforeEach((to, from, next) => {
  const router = useRouter();

  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.title);

  if (nearestWithTitle) {
    document.title = nearestWithTitle.meta.title + " | " + title || title;
  }

  const isAuthRequired = to.meta.authRequired;

  if (!isAuthRequired) {
    return next();
  }
  const isLoggedIn = authService.verifyToken(tokenLocalStorage.getItems())
  if (isAuthRequired && isLoggedIn) {
    next();
  } else {
    router.push("/signin");
  }

});

export default router;
