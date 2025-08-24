import { activeSub } from "./effect";
import { Link, link, propagate } from "./system";

function createReactive(target: any) {
  return new Proxy(target, handler);
}

/**
 *
 */
const handler = {
  get(target, prop, receiver) {
    // 获取代理
    track(target, prop);
    return Reflect.get(target, prop, receiver);
  },
  set(traget, prop, newValue, receiver) {
    const res = Reflect.set(traget, prop, newValue, receiver);
    // 派发更新
    trigger(traget, prop);
    return res;
  },
};

/**
 * 绑定 target 的 key 关联的所有的 Dep
 * obj = { a:0, b:1 }
 * targetMap = {
 *  [obj]:{
 *    a:Dep,
 *    b:Dep
 *  }
 * }
 */
type TargetMap = WeakMap<object, Map<string | number | symbol, Dep>>;
const targetMap: TargetMap = new WeakMap();
/**
 * 收集依赖
 */
function track(target: any, key: any) {
  // 如果 activeSub 为空，取消依赖收集
  if (!activeSub) {
    return;
  }

  // 找对象是否收集过依赖
  let depsMap = targetMap.get(target);
  // 如果找不到，创建依赖关系
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  // 找键
  let dep = depsMap.get(key);
  // 如果键也找不到，继续创建依赖关系
  if (!dep) {
    dep = new Dep();
    depsMap.set(key, dep);
  }

  // 绑定依赖关系
  link(dep, activeSub);
}

/**
 * 触发更新
 */
function trigger(target: any, key: any) {
  // 寻找 这个对象是否在 targetMap 中
  const depsMap = targetMap.get(target);
  // 没找到，直接返回
  if (!depsMap) {
    return;
  }
  // 找对应的key
  const dep = depsMap.get(key);
  if (!dep) {
    return;
  }

  propagate(dep.subs as Link);
}

class Dep {
  subs?: Link;
  subsTail?: Link;
}

export function reactive(target: any) {
  return createReactive(target);
}
