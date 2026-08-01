"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// El bundling de Next.js rompe las rutas de ícono por defecto de Leaflet
// (asume un webpack "plano" tipo CRA). Se resuelven contra el CDN de unpkg
// en vez de contra el paquete local — mismo truco usado en cualquier
// integración Leaflet + Next.js.
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Centro de Tegucigalpa — mismo valor que usa el picker de la app móvil,
// para que el punto de partida sea idéntico en ambas plataformas.
const DEFAULT_CENTER: [number, number] = [14.0723, -87.1921];

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface LocationMapPickerInnerProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
}

export default function LocationMapPickerInner({
  latitude,
  longitude,
  onChange,
}: LocationMapPickerInnerProps) {
  const hasPosition = latitude != null && longitude != null;
  const position: [number, number] = hasPosition ? [latitude, longitude] : DEFAULT_CENTER;

  return (
    <MapContainer
      center={position}
      zoom={hasPosition ? 15 : 12}
      style={{ height: 280, width: "100%", borderRadius: 8 }}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker
        position={position}
        draggable
        eventHandlers={{
          dragend: (e) => {
            const { lat, lng } = e.target.getLatLng();
            onChange(lat, lng);
          },
        }}
      />
      <ClickHandler onPick={onChange} />
    </MapContainer>
  );
}
