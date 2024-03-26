import { UserType } from "@/app/http/types";
import LocalStorage from "@/app/localStorage";
import {LS_KEY_TOKEN, LS_KEY_USER, LS_KEY_USERS} from "@/app/const";
import {jwtDecode, JwtPayload} from "jwt-decode";
import HttpService from "@/app/http/httpService";

const tokenLocalStorage = new LocalStorage(LS_KEY_TOKEN);
const userLocalStorage = new LocalStorage(LS_KEY_USER);

type customJwtPayload = JwtPayload & { exp: number };


const httpService = new HttpService()
export default class AuthService {
  constructor() {}

  getUser() {
    return userLocalStorage.getItems();
  }
  getToken() {
    return tokenLocalStorage.getItems()
  }

  async login(payload: UserType) {
    const data = await httpService.post('/auth/login', payload)
    if (data.access_token) {
      // const preparedData = {
      //   ...userData,
      //   token: "fake-token",
      // };
      // userLocalStorage.setItems(preparedData);
      tokenLocalStorage.setItems(data.access_token)
      return data.access_token;
    } else {
      throw new Error("These credentials do not match our records.");
    }
  }

   verifyToken (accessToken: string)  {
    if(!accessToken) {
      return false
    }

    const decoded =  jwtDecode<customJwtPayload>(accessToken)

    return decoded.exp > Date.now() / 10000
  }


}
