
// import { Viewer } from "cesium";
interface Window {
    TDT_TK: string; //注意这里如果不写any那么用window.jim是可以的，但是用window.jim.hu 就会报错
  }

declare module '*.vue' {
    import { ComponentOptions } from 'vue'
    const componentOptions: ComponentOptions
    export default componentOptions
}



