import { isRef } from "./ref";
import { EffectReactive } from "./effect";

export function watch(source: any, cb: Function, options = {}) {
  let getter;
  if (isRef(source)) {
    getter = () => source.value;
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
  // 收集依赖
  oldValue = effect.run();

  // 清理 watch
  function stop() {
    // effect.stop();
  }

  return stop;
}
