export function patchClass(el: HTMLElement, nextValue: any) {
  // 将当前的类加入到el中
  if (nextValue == undefined) {
    el.className = nextValue;
  } else {
    el.removeAttribute("class");
  }
}
