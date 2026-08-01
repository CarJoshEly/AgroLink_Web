"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { LocateFixed } from "lucide-react";

// Leaflet toca `window`/`document` al cargar — hay que desactivar SSR para
// este componente o Next.js truena renderizándolo en el servidor.
const LocationMapPickerInner = dynamic(() => import("./LocationMapPickerInner"), {
  ssr: false,
  loading: () => <div className="h-[280px] w-full rounded-stamp bg-forest-50 animate-pulse" />,
});

interface LocationMapPickerProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
}

/** Selector de ubicación sobre OpenStreetMap (sin API key, sin costo) —
 * mismo enfoque que usa la app móvil en `LocationPickerScreen`. */
export default function LocationMapPicker({ latitude, longitude, onChange }: LocationMapPickerProps) {
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setGeoError("Tu navegador no soporta geolocalización.");
      return;
    }
    setLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange(pos.coords.latitude, pos.coords.longitude);
        setLocating(false);
      },
      () => {
        setGeoError("No se pudo obtener tu ubicación. Concede el permiso o marca el punto manualmente.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-forest-800">Ubicación del negocio</span>
        <button
          type="button"
          onClick={useCurrentLocation}
          disabled={locating}
          className="flex items-center gap-1.5 text-xs font-medium text-forest-700 hover:text-forest-900 disabled:opacity-50"
        >
          <LocateFixed size={14} />
          {locating ? "Ubicando…" : "Usar mi ubicación"}
        </button>
      </div>
      <LocationMapPickerInner latitude={latitude} longitude={longitude} onChange={onChange} />
      <p className="text-xs text-soil-500">
        Toca el mapa o arrastra el pin para marcar la ubicación exacta de tu negocio.
      </p>
      {geoError && <p className="text-xs text-red-600">{geoError}</p>}
      {latitude != null && longitude != null && (
        <p className="text-xs text-soil-500 font-mono">
          {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </p>
      )}
    </div>
  );
}
