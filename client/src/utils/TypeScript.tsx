export function prop<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

export function instanceOf<T>(object: any): object is T {
  return 'member' in object;
}