export function omit<T = Record<string, any>>(obj: T, ...keys: Array<keyof T>) {
  const params: any = {};
  for (let i = keys.length; i-- !== 0; ) {
    params[keys[i]] = obj[keys[i]];
  }

  return params as Partial<T>;
}
