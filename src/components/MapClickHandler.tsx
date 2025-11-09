// MapClickHandler.tsx  (sau în același fișier)
import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import type { LeafletMouseEvent } from 'leaflet';

interface Props {
  onLocationSelect?: (lat: number, lng: number) => void;
}

const MapClickHandler: React.FC<Props> = ({ onLocationSelect }) => {
  // ← useMap este apelat direct în corpul componentei
  const map = useMap();

  useEffect(() => {
    if (!onLocationSelect) return;

    const handler = (e: LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      console.log(lat, lng);
      onLocationSelect(lat, lng);
    };

    map.on('click', handler);

    // cleanup
    return () => {
      map.off('click', handler);
    };
  }, [map, onLocationSelect]); // dependențe corecte

  return null;
};

export default MapClickHandler;