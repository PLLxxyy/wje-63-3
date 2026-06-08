import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useBenchStore } from '../../store/useBenchStore';
import BenchMarker, { PendingMarker } from './BenchMarker';
import { getCurrentPosition } from '../../utils/geocoding';
import { Locate } from 'lucide-react';

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

function MapEvents() {
  const { isAdding, setAdding } = useBenchStore();
  
  useMapEvents({
    click: (e) => {
      if (isAdding) {
        setAdding(true, { lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });
  
  return null;
}

export default function BenchMap() {
  const { getFilteredBenches, selectedBench, isAdding, pendingLocation } = useBenchStore();
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.9042, 116.4074]);
  const [mapZoom, setMapZoom] = useState(12);
  const [isLocating, setIsLocating] = useState(false);

  const filteredBenches = getFilteredBenches();

  useEffect(() => {
    const initPosition = async () => {
      const pos = await getCurrentPosition();
      setMapCenter([pos.lat, pos.lng]);
    };
    initPosition();
  }, []);

  useEffect(() => {
    if (selectedBench) {
      setMapCenter([selectedBench.lat, selectedBench.lng]);
      setMapZoom(15);
    }
  }, [selectedBench]);

  useEffect(() => {
    if (pendingLocation) {
      setMapCenter([pendingLocation.lat, pendingLocation.lng]);
      setMapZoom(16);
    }
  }, [pendingLocation]);

  const handleLocate = async () => {
    setIsLocating(true);
    try {
      const pos = await getCurrentPosition();
      setMapCenter([pos.lat, pos.lng]);
      setMapZoom(14);
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className="w-full h-full z-0"
        style={{ cursor: isAdding ? 'crosshair' : 'grab' }}
        scrollWheelZoom={true}
      >
        <ChangeView center={mapCenter} zoom={mapZoom} />
        <MapEvents />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {filteredBenches.map((bench, index) => (
          <BenchMarker
            key={bench.id}
            bench={bench}
            index={index}
          />
        ))}

        {isAdding && <PendingMarker />}
      </MapContainer>

      <button
        onClick={handleLocate}
        disabled={isLocating}
        className="absolute bottom-6 right-6 z-[1000] p-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 border border-stone-200"
        title="定位到当前位置"
      >
        <Locate className={`w-5 h-5 text-stone-600 ${isLocating ? 'animate-spin' : ''}`} />
      </button>

      {isAdding && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full shadow-lg flex items-center gap-2">
          <span className="text-2xl animate-bounce">📍</span>
          <span style={{ fontFamily: "'Lora', serif" }}>点击地图选择长椅位置</span>
        </div>
      )}
    </div>
  );
}
