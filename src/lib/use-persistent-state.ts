"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const listeners = new Map<string, Set<() => void>>();

function emit(key: string) {
  const set = listeners.get(key);
  if (set) {
    for (const listener of set) listener();
  }
}

function subscribeToKey(key: string) {
  return (onStoreChange: () => void) => {
    let set = listeners.get(key);
    if (!set) {
      set = new Set();
      listeners.set(key, set);
    }
    set.add(onStoreChange);

    const onStorage = (event: StorageEvent) => {
      if (event.key === key) onStoreChange();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      set.delete(onStoreChange);
      window.removeEventListener("storage", onStorage);
    };
  };
}

function readStorage(key: string, fallback: string) {
  try {
    return window.localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function useHasMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function usePersistentState<T>(key: string, initial: T) {
  const fallback = useMemo(() => JSON.stringify(initial), [initial]);
  const subscribe = useMemo(() => subscribeToKey(key), [key]);
  const mounted = useHasMounted();
  const raw = useSyncExternalStore(
    subscribe,
    () => readStorage(key, fallback),
    () => fallback
  );

  const parsed = useMemo(() => {
    try {
      return JSON.parse(raw) as T;
    } catch {
      return initial;
    }
  }, [initial, raw]);

  const state = mounted ? parsed : initial;

  const setState = useCallback(
    (next: T) => {
      window.localStorage.setItem(key, JSON.stringify(next));
      emit(key);
    },
    [key]
  );

  return [state, setState, mounted] as const;
}
