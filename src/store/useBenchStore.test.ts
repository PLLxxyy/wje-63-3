import { describe, beforeEach, it, expect } from 'vitest';
import { useBenchStore } from './useBenchStore';
import type { Bench } from '../types/bench';

const mockBenches: Bench[] = [
  {
    id: 'bench-1',
    name: '长椅1',
    location: '位置1',
    description: '描述1',
    city: '上海',
    lat: 31.2165,
    lng: 121.4638,
    photos: [],
    tags: ['适合阅读'],
    environmentType: '公园',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'bench-2',
    name: '长椅2',
    location: '位置2',
    description: '描述2',
    city: '上海',
    lat: 31.2170,
    lng: 121.4640,
    photos: [],
    tags: ['有树荫'],
    environmentType: '公园',
    createdAt: '2026-01-02T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
  },
  {
    id: 'bench-3',
    name: '长椅3',
    location: '位置3',
    description: '描述3',
    city: '上海',
    lat: 31.2180,
    lng: 121.4650,
    photos: [],
    tags: ['适合午睡'],
    environmentType: '公园',
    createdAt: '2026-01-03T00:00:00.000Z',
    updatedAt: '2026-01-03T00:00:00.000Z',
  },
  {
    id: 'bench-4',
    name: '长椅4',
    location: '位置4',
    description: '描述4',
    city: '上海',
    lat: 31.2200,
    lng: 121.4670,
    photos: [],
    tags: ['人少'],
    environmentType: '江边',
    createdAt: '2026-01-04T00:00:00.000Z',
    updatedAt: '2026-01-04T00:00:00.000Z',
  },
  {
    id: 'bench-5',
    name: '长椅5',
    location: '位置5',
    description: '描述5',
    city: '上海',
    lat: 31.2250,
    lng: 121.4700,
    photos: [],
    tags: ['有夕阳'],
    environmentType: '街角',
    createdAt: '2026-01-05T00:00:00.000Z',
    updatedAt: '2026-01-05T00:00:00.000Z',
  },
  {
    id: 'bench-6',
    name: '长椅6',
    location: '位置6',
    description: '描述6',
    city: '北京',
    lat: 39.9042,
    lng: 116.4074,
    photos: [],
    tags: ['适合阅读'],
    environmentType: '校园',
    createdAt: '2026-01-06T00:00:00.000Z',
    updatedAt: '2026-01-06T00:00:00.000Z',
  },
];

describe('useBenchStore - getNearbyBenches', () => {
  beforeEach(() => {
    useBenchStore.setState({
      benches: mockBenches,
    });
  });

  it('should exclude the current bench from results', () => {
    const { getNearbyBenches } = useBenchStore.getState();
    const result = getNearbyBenches('bench-1');

    const hasCurrentBench = result.some((bench) => bench.id === 'bench-1');
    expect(hasCurrentBench).toBe(false);
    expect(result.length).toBe(mockBenches.length - 1);
  });

  it('should return benches sorted by distance ascending', () => {
    const { getNearbyBenches } = useBenchStore.getState();
    const result = getNearbyBenches('bench-1');

    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].distance).toBeLessThanOrEqual(result[i + 1].distance);
    }
  });

  it('should return nearest benches first', () => {
    const { getNearbyBenches } = useBenchStore.getState();
    const result = getNearbyBenches('bench-1');

    expect(result[0].id).toBe('bench-2');
    expect(result[1].id).toBe('bench-3');
    expect(result[2].id).toBe('bench-4');
    expect(result[3].id).toBe('bench-5');
    expect(result[4].id).toBe('bench-6');
  });

  it('should include distance field in result', () => {
    const { getNearbyBenches } = useBenchStore.getState();
    const result = getNearbyBenches('bench-1');

    result.forEach((bench) => {
      expect(bench).toHaveProperty('distance');
      expect(typeof bench.distance).toBe('number');
      expect(bench.distance).toBeGreaterThanOrEqual(0);
    });
  });

  it('should limit results by the limit parameter', () => {
    const { getNearbyBenches } = useBenchStore.getState();

    const result3 = getNearbyBenches('bench-1', 3);
    expect(result3.length).toBe(3);

    const result1 = getNearbyBenches('bench-1', 1);
    expect(result1.length).toBe(1);
    expect(result1[0].id).toBe('bench-2');

    const result0 = getNearbyBenches('bench-1', 0);
    expect(result0.length).toBe(0);
  });

  it('should use default limit of 5 when not specified', () => {
    const { getNearbyBenches } = useBenchStore.getState();
    const result = getNearbyBenches('bench-1');

    expect(result.length).toBe(5);
  });

  it('should return all other benches when limit exceeds available', () => {
    const { getNearbyBenches } = useBenchStore.getState();
    const result = getNearbyBenches('bench-1', 100);

    expect(result.length).toBe(mockBenches.length - 1);
  });

  it('should return empty array for non-existent bench id', () => {
    const { getNearbyBenches } = useBenchStore.getState();
    const result = getNearbyBenches('non-existent-id');

    expect(result).toEqual([]);
  });

  it('should return empty array when only one bench exists', () => {
    useBenchStore.setState({
      benches: [mockBenches[0]],
    });

    const { getNearbyBenches } = useBenchStore.getState();
    const result = getNearbyBenches('bench-1');

    expect(result).toEqual([]);
  });

  it('should preserve all bench properties in results', () => {
    const { getNearbyBenches } = useBenchStore.getState();
    const result = getNearbyBenches('bench-1', 1);
    const bench = result[0];

    expect(bench.id).toBe('bench-2');
    expect(bench.name).toBe('长椅2');
    expect(bench.location).toBe('位置2');
    expect(bench.description).toBe('描述2');
    expect(bench.city).toBe('上海');
    expect(bench.lat).toBe(31.2170);
    expect(bench.lng).toBe(121.4640);
    expect(bench.tags).toEqual(['有树荫']);
    expect(bench.environmentType).toBe('公园');
    expect(bench.createdAt).toBe('2026-01-02T00:00:00.000Z');
    expect(bench.updatedAt).toBe('2026-01-02T00:00:00.000Z');
  });
});
