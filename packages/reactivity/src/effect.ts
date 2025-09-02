import { RefImp } from "./ref";
import { endTracking, Link, startTracking, Sub } from "./system";

// 将effect 改造为对象
export let activeSub: EffectReactive | undefined;

export function setActiveSub(sub: any) {
  activeSub = sub;
}

export class EffectReactive implements Sub {
  fn: Function;
  prevSub: EffectReactive | undefined;
  deps: Link | undefined;
  depsTail: Link | undefined;

  tracking = false;

  dirty = false;

  constructor(fn: Function) {
    this.fn = fn;
  }
  run() {
    // 保存上一个的 activeSub
    this.prevSub = activeSub;
    this.dirty = false;
    startTracking(this);
    setActiveSub(this);
    try {
      return this.fn();
    } finally {
      // 恢复上一个的 activeSub
      endTracking(this);
      setActiveSub(this.prevSub);
    }
  }

  /**
   * 自身的 scheduler方法， 调用run
   */
  scheduler() {
    this.run();
  }
  notify() {
    this.scheduler();
  }
  stop() {
    startTracking(this);
    endTracking(this);
  }
}
export function effect(fn: any) {
  const effectIns = new EffectReactive(fn);
  effectIns.run();
  return effectIns;
}
