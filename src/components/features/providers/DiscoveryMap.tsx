"use client";

import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { useCallback, useState, useEffect, useRef } from "react";
import { Provider } from "@/types/provider.types";
import { Loader2, Map as MapIcon, Star, MapPin } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 6.5244, // Default to Lagos
  lng: 3.3792,
};

interface DiscoveryMapProps {
  providers: Provider[];
}

export default function DiscoveryMap({ providers }: DiscoveryMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    mapRef.current = map;
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    mapRef.current = null;
    setMap(null);
  }, []);

  // Fit bounds when providers change
  useEffect(() => {
    if (map && providers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      let hasValidCoords = false;
      providers.forEach((p) => {
        if (p.location?.coordinates) {
          bounds.extend({
            lat: p.location.coordinates.coordinates[1],
            lng: p.location.coordinates.coordinates[0],
          });
          hasValidCoords = true;
        }
      });
      if (hasValidCoords) {
        map.fitBounds(bounds);
        // Don't zoom in too much if there's only one marker
        if (providers.length === 1) {
          const listener = window.google.maps.event.addListener(map, "idle", () => {
            map.setZoom(14);
            window.google.maps.event.removeListener(listener);
          });
        }
      }
    }
  }, [map, providers]);

  if (!apiKey) {
    return (
      <div className="absolute inset-0 bg-glam-blush/50 flex items-center justify-center p-8 text-center">
        <div className="max-w-xs">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4 text-muted-foreground">
            <MapIcon size={32} />
          </div>
          <h3 className="text-lg font-bold text-glam-plum mb-2">Google Maps API Key Missing</h3>
          <p className="text-sm text-glam-blush/500 font-medium">
            Please add <code className="bg-slate-100 px-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to your <code className="bg-slate-100 px-1 rounded">.env.local</code> file to enable the real map.
          </p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="absolute inset-0 bg-glam-blush/50 flex items-center justify-center">
        <p className="text-glam-blush/500 font-medium font-peculiar text-black uppercase tracking-widest text-[10px]">Error loading maps</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="absolute inset-0 bg-glam-blush/50 flex items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={12}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={() => setSelectedProvider(null)}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      }}
    >
      {providers.map((provider) => {
        if (!provider.location?.coordinates) return null;
        return (
          <Marker
            key={provider._id}
            position={{
              lat: provider.location.coordinates.coordinates[1],
              lng: provider.location.coordinates.coordinates[0],
            }}
            onClick={() => setSelectedProvider(provider)}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
            }}
          />
        );
      })}

      {selectedProvider && selectedProvider.location?.coordinates && (
        <InfoWindow
          position={{
            lat: selectedProvider.location.coordinates.coordinates[1],
            lng: selectedProvider.location.coordinates.coordinates[0],
          }}
          onCloseClick={() => setSelectedProvider(null)}
        >
          <div className="p-2 min-w-[200px]">
            <h4 className="font-bold text-glam-plum">{selectedProvider.businessName}</h4>
            <div className="flex items-center gap-1 mt-1">
              <Star size={12} className="text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold">{selectedProvider.rating}</span>
              <span className="text-[10px] text-muted-foreground">({selectedProvider.totalReviews})</span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-glam-blush/500">
              <MapPin size={12} />
              <span className="text-[10px] truncate">{selectedProvider.location.address}</span>
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
