/**
 * 封装 dom 节点操作的 API
 */

export const nodeOps = {
  // 插入节点
  insert(el, parent, anchor) {
    // insertBefore 如果第二个参数为 null，那它就等于 appendChild
    parent.insertBefore(el, anchor || null);
  },
  // 创建元素
  createElement(type) {
    return document.createElement(type);
  },
  // 移除元素
  remove(el) {
    const parentNode = el.parentNode;
    if (parentNode) {
      parentNode.removeChild(el);
    }
  },
  // 设置元素的 text
  setElementText(el, text) {
    el.textContent = text;
  },
  // 创建文本节点
  createText(text) {
    return document.createTextNode(text);
  },
  // 设置 nodeValue
  setText(node, text) {
    return (node.nodeValue = text);
  },
  // 获取到父节点
  parentNode(el) {
    return el.parentNode;
  },
  // 获取到下一个兄弟节点
  nextSibling(el) {
    return el.nextSibling;
  },
  // dom 查询
  querySelector(selector) {
    return document.querySelector(selector);
  },
};
