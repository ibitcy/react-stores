export function omit<T = Record<string, any>>(obj: T, ...keys: Array<keyof T>) {
  const params: any = {};
  for (let i = 0; i < keys.length; i++) {
    params[keys[i]] = obj[keys[i]];
  }

  return params as Partial<T>;
}
