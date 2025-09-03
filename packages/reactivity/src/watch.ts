import { isRef } from "./ref";
import { EffectReactive } from "./effect";
import { isObject } from "@vue/shared";
import { isReactive } from "./reactive";

export function watch(source: any, cb: Function, options: any = {}) {
  let { immediate, once, deep } = options;
  let getter = source;
  if (isRef(source)) {
    getter = () => source.value;
  } else if (isReactive(source)) {
    getter = () => source;
    deep = true;
  }

  if (deep) {
    const baseGetter = getter;
    deep = deep === true ? Infinity : deep;
    getter = () => travers(baseGetter(), deep, new Set());
  }

  // 旧值
  let oldValue: any;

  function job() {
    // 重新收集依赖
    const newValue = effect.run();
    // 调用回调函数
    cb(newValue, oldValue);
    // 将新值复制给旧值
    oldValue = newValue;
  }

  // 利用effect
  const effect = new EffectReactive(getter as Function);
  // 派发更新执行的函数
  effect.scheduler = job;
  // 执行一次
  if (once) {
    const _cb = cb;
    cb = (...args: any) => {
      _cb(...args);
      stop();
    };
  }
  // 立即执行
  if (immediate) {
    job();
  } else {
    // 收集依赖
    oldValue = effect.run();
  }

  // 清理 watch
  function stop() {
    effect.stop();
  }

  function travers(value: any, depth: number, seen: Set<any>) {
    if (!isObject(value) || depth < 0 || seen.has(value)) {
      return value;
    }
    depth--;
    seen.add(value);

    for (const key in value) {
      travers(value[key], depth, seen);
    }
    return value;
  }

  return stop;
}
