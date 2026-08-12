import { watch, type Ref } from "vue";

export interface UrlStateOptions<T> {
  parse?: (raw: string) => T;
  serialize?: (val: T) => string;
  defaultValue?: T;
}

export function syncToUrl<T>(r: Ref<T>, name: string, opts: UrlStateOptions<T> = {}) {
  if (typeof window === "undefined") return;
  const parse = opts.parse ?? ((raw: string) => raw as unknown as T);
  const serialize = opts.serialize ?? ((v: T) => String(v));

  const raw = new URLSearchParams(window.location.search).get(name);
  if (raw !== null && raw !== "") {
    r.value = parse(raw);
  }

  watch(r, (val) => {
    const url = new URL(window.location.href);
    const isDefault = opts.defaultValue !== undefined && val === opts.defaultValue;
    if (val === "" || val == null || isDefault) {
      url.searchParams.delete(name);
    } else {
      url.searchParams.set(name, serialize(val));
    }
    window.history.replaceState({}, "", url);
  });
}
