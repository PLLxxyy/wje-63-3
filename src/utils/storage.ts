import type { Bench } from '../types/bench';

const STORAGE_KEY = 'city-bench-map-data';

export const saveToStorage = (benches: Bench[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(benches));
  } catch (error) {
    console.error('保存数据失败:', error);
  }
};

export const loadFromStorage = (): Bench[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data) as Bench[];
    }
  } catch (error) {
    console.error('读取数据失败:', error);
  }
  return [];
};

export const clearStorage = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};
