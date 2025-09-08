import { ShapeFlags, isString, isArray } from "@vue/shared";
export function isVnode(value: any) {
  return value.__v_isVNode;
}
/**
 * 创建vnode
 * @param type 类型
 * @param props props
 * @param children 子节点
 */
export function createVNode(type: string, props?: any, children?: any) {
  let shapeFlag = 0;
  if (isString(type)) {
    shapeFlag |= ShapeFlags.ELEMENT;
  }
  if (isString(children)) {
    shapeFlag |= ShapeFlags.STATEFUL_COMPONENT;
  } else if (isArray(children)) {
    shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
  }
  return {
    __v_isVNode: true,
    type,
    props,
    children,
    key: props.key,
    shapeFlag,
  };
}
