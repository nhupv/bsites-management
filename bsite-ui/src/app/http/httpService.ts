import axios from "@/app/http/axios";

export default class HttpService {
  constructor() {}

  async get(path: string) {
    try {
      const { data } = await axios.get(`${path}`);
      return data;
    } catch (error: any) {
      throw error;
    }
  }

  async post(path: string, payload: { [key: string]: any }) {
    try {
      const {data} = await axios.post(`${path}`, payload);
      return data;
    } catch (error: any) {
      throw error;
    }
  }

  async patch(path: string, payload: { [key: string]: any }) {
    try {
      const { data } = await axios.patch(`${path}`, payload);
      return data;
    } catch (error: any) {
      console.log(error)
      throw error;
    }
  }

  async delete(path: string) {
    try {
      const { data } = await axios.delete(`${path}`);
      return data;
    } catch (error: any) {
      throw error;
    }
  }
}
