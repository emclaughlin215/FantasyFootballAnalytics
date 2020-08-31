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