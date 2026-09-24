import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icons for bundlers
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

export default function RouteMap({
  originCoords, // [lon, lat]
  destinationCoords, // [lon, lat]
  routeGeometry, // GeoJSON LineString
  onMapClick,
  className = 'h-72 w-full rounded-2xl overflow-hidden relative z-0 isolate',
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default centered on India
      const map = L.map(mapContainerRef.current, {
        center: [28.6139, 77.209],
        zoom: 6,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;

      if (onMapClick) {
        map.on('click', (e) => {
          onMapClick([e.latlng.lng, e.latlng.lat]);
        });
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Layers & Route Polyline whenever coordinates change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 150);

    layerGroup.clearLayers();
    const bounds = L.latLngBounds([]);

    // Add Origin Marker
    if (originCoords && originCoords.length === 2) {
      const [oLon, oLat] = originCoords;
      const originMarker = L.circleMarker([oLat, oLon], {
        radius: 8,
        fillColor: '#008f87',
        color: '#ffffff',
        weight: 3,
        opacity: 1,
        fillOpacity: 1,
      }).bindPopup('<b>Departure Origin</b>');
      layerGroup.addLayer(originMarker);
      bounds.extend([oLat, oLon]);
    }

    // Add Destination Marker
    if (destinationCoords && destinationCoords.length === 2) {
      const [dLon, dLat] = destinationCoords;
      const destMarker = L.circleMarker([dLat, dLon], {
        radius: 8,
        fillColor: '#ef4444',
        color: '#ffffff',
        weight: 3,
        opacity: 1,
        fillOpacity: 1,
      }).bindPopup('<b>Destination</b>');
      layerGroup.addLayer(destMarker);
      bounds.extend([dLat, dLon]);
    }

    // Add Route Polyline
    if (routeGeometry && routeGeometry.coordinates) {
      // GeoJSON has [lon, lat], Leaflet polyline expects [lat, lon]
      const latLngs = routeGeometry.coordinates.map(([lon, lat]) => [lat, lon]);
      const polyline = L.polyline(latLngs, {
        color: '#008f87',
        weight: 5,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
      });
      layerGroup.addLayer(polyline);
      bounds.extend(polyline.getBounds());
    }

    // Fit map to markers and route
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    }
  }, [originCoords, destinationCoords, routeGeometry]);

  return <div ref={mapContainerRef} className={`${className} relative z-0 isolate`} />;
}
