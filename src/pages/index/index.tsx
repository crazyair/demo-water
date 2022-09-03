import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";
import "./index.less";
import { WatermarkOptions } from "./types";
import { getDrawPattern } from "./utils";

const watermarkConfig: WatermarkOptions = {
  gapX: 50,
  gapY: 50,
  offsetLeft: 0,
  offsetTop: 50,
  width: 100,
  height: 64,
  opacity: 0.15,
  rotate: -22,
  fontSize: 16,
  fontStyle: "normal",
  fontVariant: "normal",
  fontWeight: "300",
  fontColor: "#000",
  fontFamily: "sans-serif",
  textAlign: "center",
  textBaseline: "alphabetic",
  blindFontSize: 16,
  blindOpacity: 0.005,
  text: "测试水印",
  blindText: "测试盲水印",
};

const Index = () => {
  const [url, setUrl] = useState("");
  useEffect(() => {
    const func = async () => {
      const { gapX, width, gapY, height } = watermarkConfig;

      const canvasWidth = (Number(gapX) + Number(width)) * 1;
      const canvasHeight = (Number(gapY) + Number(height)) * 1;

      // 把图片画到离屏 canvas 上
      const canvas = (Taro.createOffscreenCanvas as any)({
        type: "2d",
        width: canvasWidth,
        height: canvasHeight,
      }) as HTMLCanvasElement;
      const result = await getDrawPattern(canvas, watermarkConfig);
      setUrl(result.url);
    };
    func();
  }, []);

  return (
    <View>
      <View className="water">
        <View className="canvas" style={{ backgroundImage: `url(${url})` }} />
        <View
          onClick={() => Taro.showToast({ title: "click" })}
          style={{
            background: "red",
            opacity: 0.5,
            height: 200,
            width: 200,
          }}
        />
        <View style={{ height: 2000 }}>111</View>
      </View>
    </View>
  );
};

export default Index;
