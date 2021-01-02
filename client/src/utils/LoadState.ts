import { prop } from "./TypeScript";

export interface LoadingLoadState {
  type: "loading";
}

export interface LoadedLoadState<T> {
  type: "loaded";
  value: T;
}

export type LoadState<T> = LoadingLoadState | LoadedLoadState<T>;

export function loading(): LoadingLoadState {
  return { type: "loading"}
}

export function loaded<T>(value: T): LoadedLoadState<T> {
  return { type: "loaded", value}
}

export function getIfLoadedOrElse<T, V>(objectToCheck: LoadState<T>, alternative: V): T | V {
  return objectToCheck.type === 'loaded' ? objectToCheck.value : alternative;
}

export function getPropertyIfLoadedOrElse<T, K extends keyof T, V>(objectToCheck: LoadState<T>, property: K, alternative: V) {
  return objectToCheck.type === 'loaded' ? prop(objectToCheck.value, property) : alternative;
}
