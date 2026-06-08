import { create } from 'zustand';
import type { Bench, BenchTag, EnvironmentType, FilterState } from '../types/bench';
import { saveToStorage, loadFromStorage, generateId } from '../utils/storage';
import { exportToGeoJSON, importFromGeoJSON, downloadGeoJSON } from '../utils/geojson';
import { MOCK_BENCHES } from '../data/mockData';

interface BenchStore {
  benches: Bench[];
  filters: FilterState;
  selectedBench: Bench | null;
  isAdding: boolean;
  pendingLocation: { lat: number; lng: number } | null;
  isFilterOpen: boolean;

  addBench: (
    bench: Omit<Bench, 'id' | 'createdAt' | 'updatedAt'>
  ) => void;
  updateBench: (id: string, updates: Partial<Bench>) => void;
  deleteBench: (id: string) => void;
  selectBench: (bench: Bench | null) => void;
  setAdding: (
    isAdding: boolean,
    location?: { lat: number; lng: number }
  ) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  toggleTagFilter: (tag: BenchTag) => void;
  setCityFilter: (city: string) => void;
  setEnvironmentFilter: (type: EnvironmentType | null) => void;
  clearFilters: () => void;
  setFilterOpen: (open: boolean) => void;
  getFilteredBenches: () => Bench[];
  getCities: () => string[];
  exportData: () => void;
  importData: (geojsonString: string) => void;
  loadFromStorage: () => void;
}

const initialFilters: FilterState = {
  tags: [],
  city: '',
  environmentType: null,
};

export const useBenchStore = create<BenchStore>((set, get) => ({
  benches: [],
  filters: initialFilters,
  selectedBench: null,
  isAdding: false,
  pendingLocation: null,
  isFilterOpen: false,

  addBench: (bench) => {
    const now = new Date().toISOString();
    const newBench: Bench = {
      ...bench,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    const benches = [...get().benches, newBench];
    set({ benches, isAdding: false, pendingLocation: null });
    saveToStorage(benches);
  },

  updateBench: (id, updates) => {
    const benches = get().benches.map((bench) =>
      bench.id === id
        ? { ...bench, ...updates, updatedAt: new Date().toISOString() }
        : bench
    );
    set({ benches });
    saveToStorage(benches);
  },

  deleteBench: (id) => {
    const benches = get().benches.filter((bench) => bench.id !== id);
    const selectedBench =
      get().selectedBench?.id === id ? null : get().selectedBench;
    set({ benches, selectedBench });
    saveToStorage(benches);
  },

  selectBench: (bench) => {
    set({ selectedBench: bench, isAdding: false });
  },

  setAdding: (isAdding, location) => {
    set({
      isAdding,
      pendingLocation: location || null,
      selectedBench: null,
    });
  },

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  toggleTagFilter: (tag) => {
    set((state) => {
      const tags = state.filters.tags.includes(tag)
        ? state.filters.tags.filter((t) => t !== tag)
        : [...state.filters.tags, tag];
      return { filters: { ...state.filters, tags } };
    });
  },

  setCityFilter: (city) => {
    set((state) => ({
      filters: { ...state.filters, city },
    }));
  },

  setEnvironmentFilter: (type) => {
    set((state) => ({
      filters: { ...state.filters, environmentType: type },
    }));
  },

  clearFilters: () => {
    set({ filters: initialFilters });
  },

  setFilterOpen: (open) => {
    set({ isFilterOpen: open });
  },

  getFilteredBenches: () => {
    const { benches, filters } = get();
    return benches.filter((bench) => {
      if (filters.tags.length > 0) {
        const hasAllTags = filters.tags.every((tag) =>
          bench.tags.includes(tag)
        );
        if (!hasAllTags) return false;
      }
      if (filters.city && bench.city !== filters.city) {
        return false;
      }
      if (
        filters.environmentType &&
        bench.environmentType !== filters.environmentType
      ) {
        return false;
      }
      return true;
    });
  },

  getCities: () => {
    const cities = new Set(get().benches.map((bench) => bench.city));
    return Array.from(cities).sort();
  },

  exportData: () => {
    const geojson = exportToGeoJSON(get().benches);
    const date = new Date().toISOString().split('T')[0];
    downloadGeoJSON(geojson, `city-benches-${date}.geojson`);
  },

  importData: (geojsonString) => {
    const importedBenches = importFromGeoJSON(geojsonString);
    const existingIds = new Set(get().benches.map((b) => b.id));
    const newBenches = importedBenches.filter(
      (b) => !existingIds.has(b.id)
    );
    const benches = [...get().benches, ...newBenches];
    set({ benches });
    saveToStorage(benches);
  },

  loadFromStorage: () => {
    const stored = loadFromStorage();
    if (stored.length > 0) {
      set({ benches: stored });
    } else {
      set({ benches: MOCK_BENCHES });
      saveToStorage(MOCK_BENCHES);
    }
  },
}));
