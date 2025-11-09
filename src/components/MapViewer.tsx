// src/components/MapViewer.tsx
import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icons (required when bundling)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapViewerProps {
  center: [number, number];
  zoom?: number;
  height?: string;
}

const MapViewer: React.FC<MapViewerProps> = ({
  center,
  zoom = 13,
  height = '100%',
}) => (
  <MapContainer
    center={center}
    zoom={zoom}
    style={{ height, width: '100%' }}
    scrollWheelZoom={false}
  >
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='© OpenStreetMap contributors'
    />
    <Marker position={center} />
  </MapContainer>
);

export default MapViewer;