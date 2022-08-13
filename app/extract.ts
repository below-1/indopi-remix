export function extract_str(q: URLSearchParams, key: string): string | undefined;
export function extract_str(q: URLSearchParams, key: string, def: string): string;
export function extract_str(q: URLSearchParams, key: string, def?: string): string | undefined {
  if (q.has(key)) {
    const v = q.get(key);
    if (!v) {
      if (def || def === '') {
        return def;
      } else {
        return;
      }
    }
    return v;
  } else {
    if (def || def === '') {
      return def;
    }
    return;
  }
}

export function extract_int(q: URLSearchParams, key: string): number | undefined;
export function extract_int(q: URLSearchParams, key: string, def: number): number;
export function extract_int(q: URLSearchParams, key: string, def?: number): number | undefined {
  if (q.has(key)) {
    const v = q.get(key);
    if (!v) {
      if (def) {
        return def;
      } else {
        return;
      }
    }
    const parsed = parseInt(v);
    return parsed;
  } else {
    if (!def) {
      return;
    }
    return def;
  }
}