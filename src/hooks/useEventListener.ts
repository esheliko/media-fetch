import { DependencyList, useEffect } from "react";

type ParametersWith<
  T extends (...args: any) => any,
  A extends Parameters<T>[0]
> = T extends (a: A, ...args: infer R) => any ? [A, ...R] : never;

export default <
  E extends Node = Document,
  T extends Parameters<E["addEventListener"]>[0] = keyof DocumentEventMap
>(
  event: T,
  callback: NonNullable<Parameters<E["addEventListener"]>[1]>,
  deps: DependencyList = [],
  { target }: { target: E | null | undefined },
) => {
  const element = target || document;
  useEffect(() => {
    element?.addEventListener(event, callback);
    return () => element?.removeEventListener(event, callback);
  }, deps);
};
