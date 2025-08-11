export let activeSub = null;
export function effect(fn: any) {
  // Implementation of effect function
  // console.log("Effect function executed");
  activeSub = fn;
  fn();
}
