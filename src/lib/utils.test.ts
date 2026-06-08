import { describe, it, expect } from 'vitest';
import { calculateDistance, formatDistance } from './utils';

describe('formatDistance', () => {
  it('should format distance less than 1km to meters', () => {
    expect(formatDistance(0.5)).toBe('500米');
    expect(formatDistance(0.123)).toBe('123米');
    expect(formatDistance(0.999)).toBe('999米');
    expect(formatDistance(0)).toBe('0米');
  });

  it('should format distance >= 1km to kilometers with one decimal', () => {
    expect(formatDistance(1)).toBe('1.0公里');
    expect(formatDistance(1.5)).toBe('1.5公里');
    expect(formatDistance(2.345)).toBe('2.3公里');
    expect(formatDistance(10)).toBe('10.0公里');
    expect(formatDistance(100.55)).toBe('100.6公里');
  });

  it('should round meters correctly', () => {
    expect(formatDistance(0.0004)).toBe('0米');
    expect(formatDistance(0.0005)).toBe('1米');
    expect(formatDistance(0.1234)).toBe('123米');
    expect(formatDistance(0.1235)).toBe('124米');
  });
});

describe('calculateDistance', () => {
  it('should return 0 for the same location', () => {
    const distance = calculateDistance(31.2304, 121.4737, 31.2304, 121.4737);
    expect(distance).toBeCloseTo(0, 5);
  });

  it('should calculate distance between two points correctly', () => {
    const distance = calculateDistance(31.2165, 121.4638, 31.2304, 121.4939);
    expect(distance).toBeGreaterThan(0);
    expect(distance).toBeLessThan(5);
  });

  it('should calculate distance between Shanghai and Beijing approximately', () => {
    const shanghai = { lat: 31.2304, lng: 121.4737 };
    const beijing = { lat: 39.9042, lng: 116.4074 };
    const distance = calculateDistance(shanghai.lat, shanghai.lng, beijing.lat, beijing.lng);
    expect(distance).toBeGreaterThan(1000);
    expect(distance).toBeLessThan(1500);
  });

  it('should be commutative', () => {
    const d1 = calculateDistance(31.2165, 121.4638, 30.2578, 120.1456);
    const d2 = calculateDistance(30.2578, 120.1456, 31.2165, 121.4638);
    expect(d1).toBeCloseTo(d2, 5);
  });
});
