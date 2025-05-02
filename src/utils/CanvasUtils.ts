// 保存离屏画布，用于调试，无法在 worker 中使用
export async function saveOffscreenCanvas(canvas: OffscreenCanvas, name: string) {
  const blob = await canvas.convertToBlob({
    type: 'image/png',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
