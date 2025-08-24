import { activeSub } from "./effect";
import { Link, link, propagate, Dependency } from "./system";
enum ReactiveFlags {
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
    this._value = value;
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
