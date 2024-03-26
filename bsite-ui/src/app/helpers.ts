import axios, {AxiosError} from "axios";
import Swal, { SweetAlertIcon } from "sweetalert2";
import {re} from "@/assets/images/flags/utils";
export const handleError =  (error: any) => {
  if(!axios.isAxiosError(error)) {
    showMessage('error', error.toString())
  } else {
    const status = error.response?.status
    if(status === 401) {
      return
    }
    if(status === 404){
      showMessage('error', 'Request not found!')
      return
    }
    if(!error.response?.data){
      showMessage('error', 'Api service not available!')
    } else {
      if(error.response?.data?.message) {
        const message = error.response?.data?.message
        if(typeof message === 'string') {
          showMessage('error', error.response?.data?.message)
          return;
        }
        if(Array.isArray(message)) {
          const errorText = message.length > 0 ? message[0] : 'Unknown error!'
          showMessage('error', errorText)
          return;
        }
        showMessage('error', 'Unknown Error')
        return;
      }
    }
  }
}

function showMessage(type: SweetAlertIcon, text: string) {
  Swal.fire({
    title: type,
    icon: type,
    text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    cancelButtonColor: '#3762ea',
    confirmButtonColor: '#3762ea'
  });
}