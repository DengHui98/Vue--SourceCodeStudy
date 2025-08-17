import { activeSub } from "./effect";
import { Link, link, propagate, type Deps } from "./system";
enum ReactiveFlags {
  IS_REF = "__v_isRef",
}


export class RefImp {
  _value;
  subs: Link;
  subsTail: Link;
  [ReactiveFlags.IS_REF] = true;
  constructor(value) {
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

export function ref(value) {
  return new RefImp(value);
}

export function isRef(ref) {
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
