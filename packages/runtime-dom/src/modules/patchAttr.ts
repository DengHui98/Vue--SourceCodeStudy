export function patchAttr(el: HTMLElement, key: string, nextValue: any) {
  if (nextValue == undefined) {
    el.removeAttribute(key);
  } else {
    el.setAttribute(key, nextValue);
  }
}
