// src/components/MapPicker.tsx
import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Same icon fix as MapViewer
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapPickerProps {
  center: [number, number];
  onLocationSelect: (lat: number, lng: number) => void;
  zoom?: number;
  height?: string;
}

/** Listens to map clicks and forwards the new coordinates */
function ClickHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const MapPicker: React.FC<MapPickerProps> = ({
  center,
  onLocationSelect,
  zoom = 13,
  height = '100%',
}) => (
  <MapContainer
    center={center}
    zoom={zoom}
    style={{ height, width: '100%' }}
    scrollWheelZoom
  >
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='© OpenStreetMap contributors'
    />
    <ClickHandler onSelect={onLocationSelect} />
    <Marker position={center} draggable />
  </MapContainer>
);

export default MapPicker;