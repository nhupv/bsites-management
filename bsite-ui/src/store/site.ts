// Utilities
import { defineStore } from "pinia";
import {SiteType} from "@/components/sites/types";
import {httpService} from "@/app/http/httpServiceProvider";
import {handleError} from "@/app/helpers";
import {LS_KEY_SITE} from "@/app/const";

export const useSite = defineStore("site-store", {
  state: (): { [key: string]: any } => ({
    siteId: localStorage.getItem(LS_KEY_SITE) || '',
    site: null,
    sites: [],
  }),
  getters: {
    siteSelected: state => !!state.siteId
  },
  actions: {
    async getSites() {
      try {
        const data = await httpService.get('/sites/list?page=1&perPage=100')
        this.sites = data.data.filter((site: SiteType) => site.status)
      } catch (e) {
        handleError(e)
      }
    },
  }
});
