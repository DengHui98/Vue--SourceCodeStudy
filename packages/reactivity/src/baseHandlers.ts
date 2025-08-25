import { isObject, hasChanged } from "@vue/shared";
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
    const res = Reflect.set(traget, prop, newValue, receiver);
    // 如果旧值是ref， 新值不是ref， 同时更新ref
    if (isRef(oldValue) && !isRef(newValue)) {
      oldValue.value = newValue;
      return res;
    }

    // 只有设置新值，才会派发更新
    if (hasChanged(oldValue, newValue)) {
      // 派发更新
      trigger(traget, prop);
    }
    return res;
  },
};
