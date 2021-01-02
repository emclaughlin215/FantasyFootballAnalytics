export function prop<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

export function instanceOf<T>(object: any): object is T {
  return 'member' in object;
}

export function getPropertyIfTrueyOrElse<T, K extends keyof T, U>(objectToCheck: T, property: K, alternative: U): T[K] | U {
  return objectToCheck ? (objectToCheck as any)[property] : alternative;
}
