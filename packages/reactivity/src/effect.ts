// 将effect 改造为对象
export let activeSub: EffectReactive | undefined;
export class EffectReactive {
  fn: Function;
  prevSub: EffectReactive | undefined;
  constructor(fn: Function) {
    this.fn = fn;
  }
  run() {
    // 保存上一个的 activeSub
    this.prevSub = activeSub;
    activeSub = this;
    try {
      this.fn();
    } finally {
      console.log(this.prevSub?.fn.name);
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
