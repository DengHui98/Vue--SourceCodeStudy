export const isObject = (value: object) => {
  return typeof value === "object" && value !== null;
};
/**
 * 看一下值有没有变
 * @param newValue
 * @param oldValue
 */
export function hasChanged(newValue: any, oldValue: any) {
  return !Object.is(newValue, oldValue);
}

/**
 * 判断是否是函数
 */
export function isFunction(fn: any) {
  return typeof fn === "function";
}
/**
 * 判断字符串
 */
export function isString(value: any) {
  return typeof value === "string"
}

/**
 * 判断事件
 */
export function isOn(value: string) {
  return /^on[A-Z]/.test(value)
}
/**
 *判断数组
 */
export const isArray = Array.isArray