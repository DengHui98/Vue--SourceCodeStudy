import { hasChanged, isFunction } from "@vue/shared";
import { ReactiveFlags } from "./ref";
import { Dependency, endTracking, link, Link, startTracking, Sub } from "./system";
import { activeSub, setActiveSub } from "./effect";

export class ComputedRefImp implements Dependency, Sub {
  [ReactiveFlags.IS_REF] = true;
  // 保存 fn 的值
  _value: undefined;
  /**
   * 订阅者
   */
  subs: Link | undefined;
  subsTail: Link | undefined;
  /**
   * 依赖项
   */
  deps: Link | undefined;
  depsTail: Link | undefined;
  tracking: boolean = false;
  // 计算属性脏不脏，如果计算属性是脏的，需要执行 update
  dirty = true;
  constructor(
    public fn: Function, // getter
    private setter: Function
  ) {}

  get value() {
    if (this.dirty) {
      this.update();
    }
    /**
     * 和 sub 做关联关系
     */
    if (activeSub) {
      link(this, activeSub);
    }
    return this._value;
  }

  set value(newValue) {
    if (this.setter) {
      this.setter(newValue);
    } else {
      console.warn("只读");
    }
  }

  update() {
    // 作为 dep
    const prevSub = activeSub;
    setActiveSub(this);
    startTracking(this);
    try {
      const oldValue = this._value;
      this._value = this.fn();
      // 如果更新完了，改为false
      this.dirty = false;
      // 如果值发生了变化，返回 ture
      return hasChanged(this._value, oldValue);
    } finally {
      endTracking(this);
      setActiveSub(prevSub);
    }
  }
}

/**
 * 计算属性
 * @param getOrOptions 函数或者是一个对象
 */
export function computed(getOrOptions: any) {
  let getter;
  let setter;
  if (isFunction(getOrOptions)) {
    getter = getOrOptions;
  } else {
    getter = getOrOptions.get;
    setter = getOrOptions.set;
  }

  return new ComputedRefImp(getter, setter);
}
