import { OffscreenCanvas } from "@tarojs/taro";

declare const wx: {
  createOffscreenCanvas: (obj: any) => OffscreenCanvas;
};

// declare const wx: {
//   qy?: { login?: any; checkSession?: any };
// };
