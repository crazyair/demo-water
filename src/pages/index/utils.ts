import { DrawPatternResult, WatermarkOptions } from "./types";

export function getDrawPattern(
  canvas: HTMLCanvasElement,
  config: WatermarkOptions
): Promise<DrawPatternResult> {
  const {
    text,
    gapX,
    gapY,
    offsetTop,
    offsetLeft,
    width,
    height,
    rotate,
    opacity,
    fontSize,
    fontStyle,
    fontVariant,
    fontWeight,
    fontFamily,
    fontColor,
    textAlign,
    textBaseline,
    image,
    blindText,
    blindFontSize,
    blindOpacity,
  } = config as Required<WatermarkOptions>;
  return new Promise((resolve, reject) => {
    // const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const ratio = 1;

    const canvasWidth = (Number(gapX) + Number(width)) * ratio;
    const canvasHeight = (Number(gapY) + Number(height)) * ratio;
    const canvasOffsetLeft = Number(offsetLeft) || Number(gapX) / 2;
    const canvasOffsetTop = Number(offsetTop) || Number(gapY) / 2;

    if (ctx) {
      const markWidth = width * ratio;
      const markHeight = height * ratio;

      ctx.translate(canvasOffsetLeft * ratio, canvasOffsetTop * ratio);
      ctx.rotate((Math.PI / 180) * Number(rotate));

      // 是否需要增加盲水印文字
      if (blindText) {
        // 盲水印需要低透明度
        ctx.globalAlpha = blindOpacity;
        ctx.font = `${blindFontSize}px normal`;
        ctx.fillText(blindText, 0, 0);
      }

      // 设置透明度
      ctx.globalAlpha = opacity;

      // 优先使用图片
      if (image) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.referrerPolicy = "no-referrer";
        img.src = image;
        img.onload = () => {
          ctx.drawImage(img, 0, 0, markWidth, markHeight);
          resolve({
            url: ctx.canvas.toDataURL(),
            width: canvasWidth,
            height: canvasHeight,
          });
        };
        return;
      }

      // 获取文本的最大宽度
      const texts = Array.isArray(text) ? text : [text];
      const widths = texts.map((item) => ctx.measureText(item).width);
      const maxWidth = Math.max(...widths);

      const markSize = Number(fontSize) * ratio;

      // 设置文本对齐方式
      ctx.textAlign = textAlign;
      // 设置文本位置
      ctx.textBaseline = textBaseline;
      // 设置字体颜色
      ctx.fillStyle = fontColor;
      // 设置字体
      ctx.font = getFont(`${markSize}px`);

      // 文案宽度大于画板宽度
      if (maxWidth > width) {
        ctx.font = getFont(`${markSize / 2}px`);
      }

      // 获取行高
      const lineHeight = markSize + 5;

      // 计算水印在y轴上的初始位置
      let initY =
        (markHeight - (fontSize * texts.length + (texts.length - 1) * 5)) / 2;
      initY = initY < 0 ? 0 : initY;

      for (let i = 0; i < texts.length; i++) {
        ctx.fillText(texts[i] || "", markWidth / 2, initY + lineHeight * i);
      }
      resolve({
        url: ctx.canvas.toDataURL(),
        width: canvasWidth,
        height: canvasHeight,
      });
    }

    function getFont(fontSize: string) {
      return `${fontStyle} ${fontVariant} ${fontWeight} ${fontSize} ${fontFamily}`;
    }

    return reject();
  });
}
