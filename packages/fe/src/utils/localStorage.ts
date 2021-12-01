export function set(key: string, value: unknown) {
  if (window.localStorage) {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  }

  return false;
}

export function get<T = unknown>(key: string): T | null {
  if (!window.localStorage) {
    return null;
  }

  const data = localStorage.getItem(key);

  if (data === null) {
    return null;
  }

  return JSON.parse(data);
}

