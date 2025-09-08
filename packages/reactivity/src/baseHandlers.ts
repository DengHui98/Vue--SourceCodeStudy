import { isObject, hasChanged } from "packages/shared/src/uitls";
import { reactive } from "./reactive";
import { track, trigger } from "./dep";
import { isRef } from "./ref";

/**
 * 代理处理函数
 */
export const handler = {
  get(target, prop, receiver) {
    // 获取代理
    track(target, prop);
    const res = Reflect.get(target, prop, receiver);
    // 如果是ref对象，返回.value 的值
    if (isRef(res)) {
      return res.value;
    }
    // 如果res 是 对象，递归代理
    if (isObject(res)) {
      return reactive(res);
    }
    return res;
  },
  set(traget, prop, newValue, receiver) {
    const oldValue = traget[prop];
    // 如果旧值是ref， 新值不是ref， 同时更新ref
    if (isRef(oldValue) && !isRef(newValue)) {
      oldValue.value = newValue;
      return true;
    }
    const isArray = Array.isArray(traget);
    const oldLength = isArray ? traget.length : 0;
    const res = Reflect.set(traget, prop, newValue, receiver);

    // 只有设置新值，才会派发更新
    if (hasChanged(oldValue, newValue)) {
      // 派发更新
      trigger(traget, prop);
    }

    const newLength = isArray ? traget.length : 0;

    if (isArray && oldLength !== newLength && prop !== "length") {
      trigger(traget, "length");
    }

    return res;
  },
};
