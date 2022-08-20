export function memo<T extends (...args: unknown[]) => unknown>(
  fnToMemoize: T
): T {
  let prevArgs: unknown[] = [{}];
  let result: unknown;
  return function (...newArgs: unknown[]) {
    if (hasDifferentArgs(prevArgs, newArgs)) {
      result = fnToMemoize(...newArgs);
      prevArgs = newArgs;
    }
    return result;
  } as T;
}

function hasDifferentArgs(prev: unknown[], next: unknown[]) {
  if (prev.length !== next.length) return true;
  for (let i = 0; i < prev.length; i++) {
    if (!Object.is(prev[i], next[i])) return true;
  }
  return false;
}
