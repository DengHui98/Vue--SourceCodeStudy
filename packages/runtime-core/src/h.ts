import { isObject } from "packages/shared/src/uitls";
import { createVNode, isVnode } from "./vnode";

export function h(type: string, proprsOrChildren?: any, children?: any) {
  const l = arguments.length;
  if (l === 2) {
    // 如果传递两个参数
    // 传递的是一个数组
    if (Array.isArray(proprsOrChildren)) {
      return createVNode(type, null, proprsOrChildren);
    }
    // 传递的是一个对象
    if (isObject(proprsOrChildren)) {
      // 1. 是否是虚拟节点
      if (isVnode(proprsOrChildren)) {
        return createVNode(type, null, [proprsOrChildren]);
      }
      // 2. 普通对象，作为 props
      return createVNode(type, proprsOrChildren, children);
    }
    return children(type, null, children);
  } else {
    //其余情况处理
    if (l > 3) {
      // 将第三个参数以及后面的参数，组成一个数组
      children = [...arguments].slice(2);
    } else if (isVnode(children)) {
      children = [children];
    }
    return createVNode(type, proprsOrChildren, children);
  }
}
