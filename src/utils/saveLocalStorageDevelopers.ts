import { Developer } from "../types/developer";


export const saveDevelopersToLocal = (data: Developer[]) => {
  const LOCAL_KEY = 'developers_storage';
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    const existing: Developer[] = raw ? (JSON.parse(raw) as Developer[]) : [];

    const map = new Map<number, Developer>();
    existing.forEach(d => {
      if (d && typeof d.id === 'number') map.set(d.id, d);
    });
    data.forEach(d => {
      if (d && typeof d.id === 'number') map.set(d.id, d);
    });

    const merged = Array.from(map.values());
    localStorage.setItem(LOCAL_KEY, JSON.stringify(merged));
  } catch (e) {
  }
};

export const updateDeveloperInLocal = (developer: Developer): void => {
  const LOCAL_KEY = 'developers_storage';
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    const list: Developer[] = raw ? (JSON.parse(raw) as Developer[]) : [];

    const idx = list.findIndex(d => d && typeof d.id === 'number' && d.id === developer.id);
    if (idx >= 0)
      list[idx] = developer;

    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
  } catch (e) {
    // ignore localStorage errors
  }
};


export const removeDeveloperFromLocal = (id: number): void => {
  const LOCAL_KEY = 'developers_storage';
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return;
    const list: Developer[] = JSON.parse(raw);
    const filtered = list.filter(d => d && typeof d.id === 'number' && d.id !== id);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(filtered));
  } catch (e) {
  }
};

export const saveDevelopersOnlineSize = (size: number) => {
  const ONLINE_SIZE_KEY = 'developers_online_size';
  try {
    localStorage.setItem(ONLINE_SIZE_KEY, JSON.stringify(size));
  } catch (e) {
    // ignore localStorage errors
  }
};

export const loadDevelopersFromLocal = (): Developer[] => {
  const LOCAL_KEY = 'developers_storage';
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? (JSON.parse(raw) as Developer[]) : [];
  } catch (e) {
    return [];
  }
};

export const loadDevelopersOnlineSize = (): number => {
  const ONLINE_SIZE_KEY = 'developers_online_size';
  try {
    const raw = localStorage.getItem(ONLINE_SIZE_KEY);
    return raw ? (JSON.parse(raw) as number) : 0;
  } catch (e) {
    return 0;
  }
};