import { DeveloperFormData } from "../types/developer";

// src/utils/offlineQueue.ts
export const OFFLINE_KEY = 'offlineDevelopers';

export function saveOfflineDeveloper(dev: DeveloperFormData) {
  const list = JSON.parse(localStorage.getItem(OFFLINE_KEY) || '[]');
  list.push(dev);
  localStorage.setItem(OFFLINE_KEY, JSON.stringify(list));
}

export function getOfflineDevelopers() {
  return JSON.parse(localStorage.getItem(OFFLINE_KEY) || '[]');
}

export function clearOfflineDevelopers() {
  localStorage.removeItem(OFFLINE_KEY);
}