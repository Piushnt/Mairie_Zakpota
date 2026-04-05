import React, { useEffect } from 'react';
import { renderToString } from 'react-dom/server';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Landmark, 
  GraduationCap, 
  Hospital,
  Church, 
  ShoppingBasket,
  Trophy, 
  MapPin 
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Styles globaux pour les marqueurs customisés
const markerStyles = `
  .custom-marker-wrapper {
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    transform-origin: bottom center;
  }
  .custom-marker-wrapper:hover {
    transform: scale(1.2) translateY(-5px);
    z-index: 1000 !important;
  }
  .custom-marker-pin {
    width: 36px;
    height: 36px;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 2px 2px 6px rgba(0,0,0,0.3);
    border: 3px solid white;
  }
  .custom-marker-icon {
    transform: rotate(45deg);
    color: white;
  }
  .custom-leaflet-icon {
    background: transparent;
    border: none;
  }
`;

// Injection des styles
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = markerStyles;
  document.head.appendChild(styleEl);
}

// Réparation des icônes par défaut de Leaflet au cas où
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
    
    // Forcer le redimensionnement immédiat et différé
    const invalidate = () => {
      map.invalidateSize();
      // Un deuxième souffle pour Leaflet
      setTimeout(() => map.invalidateSize(), 300);
      setTimeout(() => map.invalidateSize(), 1000);
    };

    invalidate();
    
    window.addEventListener('resize', invalidate);
    window.addEventListener('orientationchange', invalidate);
    
    return () => {
      window.removeEventListener('resize', invalidate);
      window.removeEventListener('orientationchange', invalidate);
    };
  }, [center, zoom, map]);
  return null;
};

// Fonction pour obtenir la configuration d'icône selon la catégorie
export const getIconConfig = (category: string) => {
  const cat = category?.toLowerCase() || '';
  
  if (cat.includes('administration') || cat.includes('mairie')) {
    return { color: '#1e3a8a', icon: <Landmark size={18} /> }; // Bleu Fonce
  }
  if (cat.includes('éducation') || cat.includes('ecole')) {
    return { color: '#059669', icon: <GraduationCap size={18} /> }; // Vert Emerald
  }
  if (cat.includes('santé') || cat.includes('hopital') || cat.includes('sante')) {
    return { color: '#dc2626', icon: <Hospital size={18} /> }; // Rouge
  }
  if (cat.includes('culte') || cat.includes('eglise') || cat.includes('mosquee')) {
    return { color: '#7c3aed', icon: <Church size={18} /> }; // Violet
  }
  if (cat.includes('commerce') || cat.includes('restaurant') || cat.includes('marché') || cat.includes('marche')) {
    return { color: '#ea580c', icon: <ShoppingBasket size={18} /> }; // Orange
  }
  if (cat.includes('sport') || cat.includes('stade') || cat.includes('loisir') || cat.includes('tourisme')) {
    return { color: '#65a30d', icon: <Trophy size={18} /> }; // Vert Prairie
  }
  
  // Par défaut
  return { color: '#4b5563', icon: <MapPin size={18} /> }; // Gris
};

// Fonction pour créer le DivIcon Leaflet
const createCustomIcon = (category: string) => {
  const config = getIconConfig(category);
  
  const iconHtml = renderToString(
    <div className="custom-marker-wrapper">
      <div 
        className="custom-marker-pin"
        style={{ backgroundColor: config.color }}
      >
        <div className="custom-marker-icon">
          {config.icon}
        </div>
      </div>
    </div>
  );

  return L.divIcon({
    html: iconHtml,
    className: 'custom-leaflet-icon',
    iconSize: [36, 46], // Largeur, Hauteur avec le rebond possible
    iconAnchor: [18, 46], // Point de fixation (bas au centre)
    popupAnchor: [0, -40] // Point d'où part le popup
  });
};

const LazyMap: React.FC<LazyMapProps> = ({ 
  center, 
  zoom, 
  markers = [], 
  height = '500px', // Par défaut 500px pour éviter les conteneurs à 0px
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
          <Marker 
            key={marker.id} 
            position={[marker.lat, marker.lng]}
            icon={createCustomIcon(marker.category)}
          >
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
