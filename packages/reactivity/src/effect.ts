import { RefImp } from "./ref";
import { endTracking, Link, startTracking } from "./system";

// 将effect 改造为对象
export let activeSub: EffectReactive | undefined;

export class EffectReactive {
  fn: Function;
  prevSub: EffectReactive | undefined;
  deps: Link | undefined;
  depsTail: Link | undefined;

  tracking = false;

  constructor(fn: Function) {
    this.fn = fn;
  }
  run() {
    // 保存上一个的 activeSub
    this.prevSub = activeSub;
    startTracking(this);
    activeSub = this;
    try {
      this.fn();
    } finally {
      // 恢复上一个的 activeSub
      endTracking(this);
      activeSub = this.prevSub;
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
}
export function effect(fn: any) {
  const effectIns = new EffectReactive(fn);
  effectIns.run();
  return effectIns;
}
