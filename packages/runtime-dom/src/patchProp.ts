import { isOn } from "packages/shared/src/uitls";
import { patchClass } from "./modules/patchClass";
import { patchStyle } from "./modules/patchStyle";
import { patchEvent } from "./modules/patchEvent";
import { patchAttr } from "./modules/patchAttr";

export function patchProp(el: HTMLElement, key: string, preValue: any, nextValue: any) {
  if (key === "class") {
    return patchClass(el, nextValue);
  }
  if (key === "style") {
    return patchStyle(el, preValue, nextValue);
  }
  if (isOn(key)) {
    return patchEvent(el, key, preValue, nextValue);
  }
  patchAttr(el, key, nextValue);
}
