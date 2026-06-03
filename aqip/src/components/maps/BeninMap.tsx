import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import AQIPBadge from '../ui/AQIPBadge';

// Correction de l'icône Leaflet par défaut
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Icônes personnalisées par statut
const createCustomIcon = (color: string) => {
  return new L.DivIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const icons = {
  success: createCustomIcon('#10B981'), // aqip-accent
  warning: createCustomIcon('#F59E0B'), // aqip-warning
  danger: createCustomIcon('#EF4444'),  // aqip-danger
};

interface MapData {
  id: string;
  nom: string;
  latitude: number;
  longitude: number;
  statut: 'success' | 'warning' | 'danger';
  maturite: string;
  agentsCount: number;
}

interface BeninMapProps {
  data: MapData[];
  layer: 'qualite' | 'satisfaction' | 'productivite';
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export default function BeninMap({ data, layer }: BeninMapProps) {
  // Centre du Bénin approximatif
  const beninCenter: [number, number] = [9.3077, 2.3158];

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-aqip-border relative z-0">
      <MapContainer 
        center={beninCenter} 
        zoom={6} 
        style={{ height: '100%', width: '100%', backgroundColor: '#0B0E1A' }}
        zoomControl={false}
      >
        <MapUpdater center={beninCenter} />
        {/* CartoDB Dark Matter for the premium dark mode look */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {data.map((centre) => (
          <Marker 
            key={centre.id} 
            position={[centre.latitude, centre.longitude]}
            icon={icons[centre.statut]}
          >
            <Popup className="aqip-popup">
              <div className="p-1">
                <div className="font-bold text-gray-900 mb-1">{centre.nom}</div>
                <div className="text-xs text-gray-600 mb-2">Maturité: {centre.maturite}</div>
                <div className="flex justify-between items-center text-xs border-t pt-2">
                  <span>Agents: <b>{centre.agentsCount}</b></span>
                  <AQIPBadge variant={centre.statut === 'danger' ? 'danger' : centre.statut === 'warning' ? 'warning' : 'success'}>
                    {centre.statut.toUpperCase()}
                  </AQIPBadge>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Légende overlay */}
      <div className="absolute bottom-4 right-4 bg-aqip-bg-elevated/90 backdrop-blur-sm p-3 rounded-lg border border-aqip-border z-[1000] shadow-xl">
        <div className="text-xs font-semibold text-white mb-2 uppercase tracking-wider">Légende : {layer}</div>
        <div className="space-y-2 text-xs text-aqip-text-muted">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-aqip-accent border border-white"></div>
            <span>Objectif atteint</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-aqip-warning border border-white"></div>
            <span>Sous surveillance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-aqip-danger border border-white"></div>
            <span>Alerte critique</span>
          </div>
        </div>
      </div>
    </div>
  );
}
