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
