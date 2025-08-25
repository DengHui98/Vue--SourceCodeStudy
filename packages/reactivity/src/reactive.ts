import { handler } from "./baseHandlers";
import { isObject } from "@vue/shared";

/**
 * 创建 reactive 对象
 * @param target
 * @returns
 */

const reactiveMap: WeakMap<object, any> = new WeakMap();
const isProxySet = new Set<object>();
/**
 * 判断是否是代理对象
 * @param obj - 对象
 */
function isProxy(obj: any) {
  return isProxySet.has(obj);
}
function createReactive(target: any) {
  // 如果是非对象，则直接返回
  if (!isObject(target)) {
    return target;
  }
  // 如果传入的是代理对象，直接返回
  if (isProxy(target)) {
    return target;
  }

  // 判断当前对象是否已经代理
  if (reactiveMap.has(target)) {
    // 直接返回代理对象
    return reactiveMap.get(target);
  }
  // 创建代理对象
  const res = new Proxy(target, handler);

  // 将代理对象和对象绑定
  reactiveMap.set(target, res);
  // 保存代理对象列表
  isProxySet.add(res);

  return res;
}

export function reactive(target: any) {
  return createReactive(target);
}
