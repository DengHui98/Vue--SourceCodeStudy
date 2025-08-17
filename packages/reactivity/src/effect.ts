import { RefImp } from "./ref";
import { Link } from "./system";

// 将effect 改造为对象
export let activeSub: EffectReactive | undefined;

export class EffectReactive {
  fn: Function;
  prevSub: EffectReactive | undefined;
  deps: Link | undefined;
  depsTail: Link | undefined;

  constructor(fn: Function) {
    this.fn = fn;
  }
  run() {
    // 保存上一个的 activeSub
    this.prevSub = activeSub;
    // 将 depsTail 重置为 undefined
    this.depsTail = undefined;
    activeSub = this;
    try {
      this.fn();
    } finally {
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
}
