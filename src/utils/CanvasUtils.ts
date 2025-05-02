export async function saveOffscreenCanvas(canvas: OffscreenCanvas, name: string) {
  // 1. 转成 Blob（默认 PNG 格式）
  const blob = await canvas.convertToBlob({
    type: 'image/png',
    quality: 0.92  // 对于 JPEG 可调画质
  });

  // 2. 生成 URL 并触发下载
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
