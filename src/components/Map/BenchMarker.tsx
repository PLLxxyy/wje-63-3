import { Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import type { Bench } from '../../types/bench';
import { useBenchStore } from '../../store/useBenchStore';
import { TAG_ICONS } from '../../types/bench';

interface BenchMarkerProps {
  bench: Bench;
  index: number;
}

const createBenchIcon = (tags: string[]) => {
  const primaryTag = tags[0] || '';
  const iconEmoji = TAG_ICONS[primaryTag as keyof typeof TAG_ICONS] || '🪑';
  
  return L.divIcon({
    className: 'custom-bench-marker',
    html: `
      <div class="bench-marker-wrapper" style="
        width: 48px;
        height: 48px;
        position: relative;
        animation: bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        opacity: 0;
      ">
        <div class="bench-marker-shadow" style="
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 32px;
          height: 8px;
          background: rgba(0,0,0,0.2);
          border-radius: 50%;
          filter: blur(3px);
        "></div>
        <div class="bench-marker-content" style="
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #F59E0B, #EA580C);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
          border: 3px solid white;
          font-size: 20px;
          position: relative;
          z-index: 1;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        ">
          ${iconEmoji}
        </div>
        <div class="bench-marker-pulse" style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          background: rgba(249, 115, 22, 0.3);
          border-radius: 50%;
          animation: pulse 2s ease-out infinite;
        "></div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 40],
    popupAnchor: [0, -35],
  });
};

const createPendingIcon = () => {
  return L.divIcon({
    className: 'pending-marker',
    html: `
      <div style="
        width: 56px;
        height: 56px;
        position: relative;
        animation: bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      ">
        <div style="
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 36px;
          height: 8px;
          background: rgba(0,0,0,0.2);
          border-radius: 50%;
          filter: blur(3px);
        "></div>
        <div style="
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #10B981, #059669);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
          border: 3px dashed white;
          font-size: 24px;
          position: relative;
          z-index: 1;
          animation: spin 3s linear infinite;
        ">
          ➕
        </div>
      </div>
    `,
    iconSize: [56, 56],
    iconAnchor: [28, 45],
  });
};

export default function BenchMarker({ bench, index }: BenchMarkerProps) {
  const { selectBench } = useBenchStore();
  const icon = createBenchIcon(bench.tags);

  return (
    <Marker
      position={[bench.lat, bench.lng]}
      icon={icon}
      eventHandlers={{
        click: () => selectBench(bench),
      }}
    >
      <Popup
        closeButton={false}
        className="bench-popup"
        offset={[0, -5]}
      >
        <div
          className="p-3 min-w-[180px]"
          style={{ fontFamily: "'Lora', serif" }}
        >
          <h4 className="font-bold text-stone-800 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            {bench.name}
          </h4>
          <p className="text-xs text-stone-500 mb-2">{bench.location}</p>
          <div className="flex flex-wrap gap-1">
            {bench.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full border border-amber-200"
              >
                {TAG_ICONS[tag]} {tag}
              </span>
            ))}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export function PendingMarker() {
  const { pendingLocation } = useBenchStore();

  if (!pendingLocation) return null;

  return (
    <Marker
      position={[pendingLocation.lat, pendingLocation.lng]}
      icon={createPendingIcon()}
    />
  );
}
