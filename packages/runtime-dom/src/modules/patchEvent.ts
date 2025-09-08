const veiKey = Symbol("_vei");
function createInvoker(fn: any): Function {
  const invoker = (e: EventTarget) => {
    invoker.value(e);
  };
  invoker.value = fn;
  return invoker;
}
export function patchEvent(el: HTMLElement, key: string, preValue: any, nextValue: any) {
  // 事件处理
  const name = key.slice(2).toLocaleLowerCase();
  //@ts-ignore
  const invokers = (el[veiKey] ??= {});
  // 拿到之前绑定的值
  const existringInvoker = invokers[key];
  if (nextValue) {
    if (existringInvoker) {
      existringInvoker.value = nextValue;
      return;
    }
    // 如果之前没有绑定，则初始化绑定
    const invoker = createInvoker(nextValue);
    invokers[key] = invoker;
    el.addEventListener(name, invoker as any);
    return;
  }
  // 更新节点如果不存在，则移除事件
  if (existringInvoker) {
    el.removeEventListener(name, existringInvoker);
    invokers[key] = undefined;
  }
}
