// MapInDiv.tsx
import React, { memo, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker URLs
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Props {
  lat: number;
  lng: number;
  zoom?: number;
  height?: string;
  onLocationSelect?: (lat: number, lng: number) => void;
}

// Force map resize after mount
const MapResizer = () => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 150);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
};

// Debounced click handler
const MapClickHandler = ({ onLocationSelect }: { onLocationSelect?: (lat: number, lng: number) => void }) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce function
  const debounced = useCallback(
    (lat: number, lng: number) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => onLocationSelect?.(lat, lng), 300);
    },
    [onLocationSelect]
  );

  // Listen to map clicks
  useMapEvents({
    click: (e) => debounced(e.latlng.lat, e.latlng.lng),
  });

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return null;
};

const MapInDiv = memo(({ lat, lng, zoom = 13, height = '280px', onLocationSelect }: Props) => {
  return (
    <div style={{ height, width: '100%' }}>
      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
          attribution="&copy; Stadia Maps"
        />
        <MapResizer />
        <MapClickHandler onLocationSelect={onLocationSelect} />
        <Marker position={[lat, lng]}>
          <Popup>Locație</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
});

export default MapInDiv;
