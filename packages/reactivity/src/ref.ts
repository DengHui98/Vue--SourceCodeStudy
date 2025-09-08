import { isObject } from "packages/shared/src/uitls";
import { activeSub, EffectReactive } from "./effect";
import { Link, link, propagate, Dependency } from "./system";
import { reactive } from "./reactive";
export enum ReactiveFlags {
  IS_REF = "__v_isRef",
}

export class RefImp implements Dependency {
  _value;
  // @ts-ignore
  subs: Link;
  // @ts-ignore
  subsTail: Link;
  [ReactiveFlags.IS_REF] = true;
  constructor(value: any) {
    this._value = isObject(value) ? reactive(value) : value;
  }
  get value() {
    trackRef(this);
    // 收集依赖
    return this._value;
  }
  set value(newValue) {
    // 触发依赖
    this._value = newValue;
    triggerRef(this);
  }
}

export function ref(value: any) {
  return new RefImp(value);
}
/**
 * 判断是否是 ref 对象
 * @param res
 * @returns
 */
export function isRef(ref: any) {
  return !!(ref && ref[ReactiveFlags.IS_REF]);
}

export function trackRef(dep: RefImp) {
  if (activeSub) {
    link(dep, activeSub);
  }
}

export function triggerRef(dep: RefImp) {
  if (dep.subs) {
    propagate(dep.subs);
  }
}

class ObjectRefImpl {
  [ReactiveFlags.IS_REF] = true;
  constructor(public _object: any, public _key: any) {}
  get value() {
    return this._object[this._key];
  }
  set value(newValue) {
    this._object[this._key] = newValue;
  }
}

export function toRef(target: any, key: any) {
  return new ObjectRefImpl(target, key);
}

export function toRefs(target: []) {
  let res: Record<string, ObjectRefImpl> = {};
  for (const key in target) {
    res[key] = toRef(target, key);
  }
  return res;
}

export function unRef(ref: RefImp) {
  return isRef(ref) ? ref.value : ref;
}

export function proxyRefs(target: any) {
  return new Proxy(target, {
    get(...args) {
      const res = Reflect.get(...args);
      return unRef(res);
    },
    set(target, key, newValue, receiver) {
      const oldValue = target[key];
      if (isRef(oldValue) && !isRef(newValue)) {
        oldValue.value = newValue;
        return true;
      }
      return Reflect.set(target, key, newValue, receiver);
    },
  });
}
