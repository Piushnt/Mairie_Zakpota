import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Réparation des icônes par défaut de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface LazyMapProps {
  center: [number, number];
  zoom: number;
  markers?: {
    id: string;
    name: string;
    category: string;
    description?: string;
    lat: number;
    lng: number;
    image_url?: string;
  }[];
  height?: string;
  className?: string;
  interactive?: boolean;
}

// Composant pour forcer le redimensionnement de la carte lors du montage
const ChangeView = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
    // Petit délai pour s'assurer que le conteneur est prêt
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [center, zoom, map]);
  return null;
};

const LazyMap: React.FC<LazyMapProps> = ({ 
  center, 
  zoom, 
  markers = [], 
  height = '400px', 
  className = '',
  interactive = true 
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ height }}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={interactive}
        dragging={interactive}
        touchZoom={interactive}
        doubleClickZoom={interactive}
        className="w-full h-full z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={center} zoom={zoom} />
        
        {markers.map((marker) => (
          <Marker key={marker.id} position={[marker.lat, marker.lng]}>
            <Popup className="custom-leaflet-popup">
              <div className="p-1 min-w-[200px]">
                {marker.image_url && (
                  <img 
                    src={marker.image_url} 
                    alt={marker.name} 
                    className="w-full h-24 object-cover rounded-lg mb-3"
                  />
                )}
                <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-1 block">
                  {marker.category}
                </span>
                <h4 className="font-bold text-ink mb-2">{marker.name}</h4>
                {marker.description && (
                  <p className="text-xs text-ink-muted leading-relaxed line-clamp-3">
                    {marker.description}
                  </p>
                )}
                <div className="mt-3 pt-3 border-t border-border flex justify-between items-center">
                  <span className="text-[9px] font-medium text-ink/40 italic">
                    {marker.lat.toFixed(4)}, {marker.lng.toFixed(4)}
                  </span>
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${marker.lat},${marker.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-black text-primary hover:underline uppercase tracking-tighter"
                  >
                    Y aller
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LazyMap;
