import type { Bench, BenchTag, EnvironmentType } from '../types/bench';

interface GeoJSONFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    id: string;
    name: string;
    location: string;
    description: string;
    city: string;
    photos: string[];
    tags: BenchTag[];
    environmentType: EnvironmentType;
    createdAt: string;
    updatedAt: string;
  };
}

interface GeoJSONCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

export const exportToGeoJSON = (benches: Bench[]): string => {
  const features: GeoJSONFeature[] = benches.map((bench) => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [bench.lng, bench.lat],
    },
    properties: {
      id: bench.id,
      name: bench.name,
      location: bench.location,
      description: bench.description,
      city: bench.city,
      photos: bench.photos,
      tags: bench.tags,
      environmentType: bench.environmentType,
      createdAt: bench.createdAt,
      updatedAt: bench.updatedAt,
    },
  }));

  const collection: GeoJSONCollection = {
    type: 'FeatureCollection',
    features,
  };

  return JSON.stringify(collection, null, 2);
};

export const importFromGeoJSON = (geojsonString: string): Bench[] => {
  try {
    const collection = JSON.parse(geojsonString) as GeoJSONCollection;
    
    if (collection.type !== 'FeatureCollection') {
      throw new Error('无效的 GeoJSON 格式');
    }

    return collection.features.map((feature) => ({
      id: feature.properties.id,
      name: feature.properties.name,
      location: feature.properties.location,
      description: feature.properties.description,
      city: feature.properties.city,
      lat: feature.geometry.coordinates[1],
      lng: feature.geometry.coordinates[0],
      photos: feature.properties.photos,
      tags: feature.properties.tags,
      environmentType: feature.properties.environmentType,
      createdAt: feature.properties.createdAt,
      updatedAt: feature.properties.updatedAt,
    }));
  } catch (error) {
    console.error('导入 GeoJSON 失败:', error);
    throw error;
  }
};

export const downloadGeoJSON = (geojson: string, filename: string): void => {
  const blob = new Blob([geojson], { type: 'application/geo+json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
