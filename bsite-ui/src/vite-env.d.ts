/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}


declare var JsonExcel: any;
declare module "vue-json-excel3" {
  export = JsonExcel;
}
