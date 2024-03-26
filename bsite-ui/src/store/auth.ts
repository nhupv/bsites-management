// Utilities
import { defineStore } from "pinia";
import { LS_KEY_TOKEN} from "@/app/const";
import {jwtDecode, JwtPayload} from "jwt-decode";

type jwtPayloadCustom = JwtPayload & { username: string }

export const useAuth = defineStore("auth-store", {
  state: (): { [key: string]: any } => ({
    token: localStorage.getItem(LS_KEY_TOKEN) || '',
  }),
  getters: {
    user: state => {
      if(!state.token) {
        return { username: ''}
      }
      return jwtDecode<jwtPayloadCustom>(state.token)
    }
  },
});
