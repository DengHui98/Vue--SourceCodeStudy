export function patchStyle(el: HTMLElement, preValue: any, nextValue: any) {
  console.log(nextValue);
  const style = el.style;
  if (nextValue) {
    for (const key in nextValue) {
      style.setProperty(key, nextValue[key]);
    }
  }
  // 上一个信息有渲染，取消渲染
  if (preValue) {
    for (const key in preValue) {
      if (key in nextValue) continue;
      style.removeProperty(key);
    }
  }
}
