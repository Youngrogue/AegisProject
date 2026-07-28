import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SecurityIncident, FilterState, MapViewState, VerificationStatus, IncidentType } from '../types';
import { NIGERIA_STATES } from '../data/nigeriaBoundaries';
import { Shield, Layers, RefreshCw, Info } from 'lucide-react';

interface MapContainerProps {
  incidents: SecurityIncident[];
  selectedIncident: SecurityIncident | null;
  hoveredIncidentId: string | null;
  onSelectIncident: (incident: SecurityIncident) => void;
  onHoverIncident: (id: string | null) => void;
  mapViewState: MapViewState;
  onViewStateChange: (viewState: MapViewState) => void;
  filterState: FilterState;
}

const TYPE_COLORS: Record<IncidentType, string> = {
  'armed-banditry': '#d97706',
  'insurgency-iswap': '#991b1b',
  'farmer-herder': '#15803d',
  'kidnapping': '#6d28d9',
  'civil-unrest': '#2563eb',
  'maritime-piracy': '#0d9488',
  'military-op': '#0f172a'
};

export const MapContainer: React.FC<MapContainerProps> = ({
  incidents,
  selectedIncident,
  hoveredIncidentId,
  onSelectIncident,
  onHoverIncident,
  mapViewState,
  onViewStateChange,
  filterState
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const boundariesGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [mapViewState.latitude, mapViewState.longitude],
        zoom: mapViewState.zoom,
        zoomControl: false,
        attributionControl: false
      });

      // Add Carto Positron / OpenStreetMap light tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Add Zoom control top-left
      L.control.zoom({ position: 'topleft' }).addTo(map);

      markersGroupRef.current = L.layerGroup().addTo(map);
      boundariesGroupRef.current = L.layerGroup().addTo(map);

      map.on('moveend', () => {
        const center = map.getCenter();
        const zoom = map.getZoom();
        onViewStateChange({
          latitude: center.lat,
          longitude: center.lng,
          zoom
        });
      });

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update Center if viewState significantly shifts from outside
  useEffect(() => {
    if (mapRef.current) {
      const current = mapRef.current.getCenter();
      if (
        Math.abs(current.lat - mapViewState.latitude) > 0.01 ||
        Math.abs(current.lng - mapViewState.longitude) > 0.01 ||
        mapRef.current.getZoom() !== mapViewState.zoom
      ) {
        mapRef.current.setView([mapViewState.latitude, mapViewState.longitude], mapViewState.zoom, {
          animate: true,
        });
      }
    }
  }, [mapViewState.latitude, mapViewState.longitude, mapViewState.zoom]);

  // Render State Boundaries if toggled
  useEffect(() => {
    if (!mapRef.current || !boundariesGroupRef.current) return;
    boundariesGroupRef.current.clearLayers();

    if (filterState.showBoundaryState) {
      NIGERIA_STATES.forEach((state) => {
        const polygon = L.polygon(state.coordinates as any, {
          color: '#041632',
          weight: 1.5,
          dashArray: '4, 4',
          fillColor: '#041632',
          fillOpacity: 0.03
        });
        polygon.bindTooltip(`<b>${state.name} State</b>`, { sticky: true });
        boundariesGroupRef.current?.addLayer(polygon);
      });
    }
  }, [filterState.showBoundaryState]);

  // Render Markers / Choropleth Mode
  useEffect(() => {
    if (!mapRef.current || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();

    if (filterState.viewMode === 'choropleth') {
      // Group incident counts per State
      const counts: Record<string, number> = {};
      incidents.forEach((inc) => {
        counts[inc.state] = (counts[inc.state] || 0) + 1;
      });

      NIGERIA_STATES.forEach((state) => {
        const count = counts[state.name] || 0;
        const opacity = Math.min(0.7, count * 0.15);
        const polygon = L.polygon(state.coordinates as any, {
          color: '#1B2B48',
          weight: 2,
          fillColor: count > 0 ? '#1B2B48' : '#e2e8f0',
          fillOpacity: opacity || 0.05
        });

        polygon.bindTooltip(
          `<div><b>${state.name} State</b><br/>${count} Active Incidents</div>`,
          { permanent: true, direction: 'center', className: 'choropleth-tooltip' }
        );
        markersGroupRef.current?.addLayer(polygon);
      });
      return;
    }

    // Render Point Markers
    incidents.forEach((incident) => {
      const isSelected = selectedIncident?.id === incident.id;
      const isHovered = hoveredIncidentId === incident.id;
      const isCentroid = incident.precisionLevel !== 'exact';

      const typeColor = TYPE_COLORS[incident.incidentType] || '#041632';

      // Visual styling for 5 Verification States
      let markerHtml = '';
      const sizePx = incident.magnitude === 'high' ? 24 : incident.magnitude === 'medium' ? 18 : 14;
      const borderSize = isSelected || isHovered ? '3px' : '2px';
      const highlightRing = isSelected ? 'ring-4 ring-amber-400 ring-offset-1 z-50' : isHovered ? 'ring-2 ring-slate-800 z-40' : '';

      const shapeClass = isCentroid ? 'rounded-none transform rotate-45' : 'rounded-full';

      switch (incident.verificationStatus) {
        case 'corroborated':
          markerHtml = `<div class="${shapeClass} ${highlightRing} transition-all duration-150 flex items-center justify-center shadow-md" style="width: ${sizePx}px; height: ${sizePx}px; background-color: ${typeColor}; border: ${borderSize} solid #ffffff;"></div>`;
          break;

        case 'single-source':
          markerHtml = `<div class="${shapeClass} ${highlightRing} transition-all duration-150 flex items-center justify-center shadow-sm" style="width: ${sizePx}px; height: ${sizePx}px; background-color: ${typeColor}; opacity: 0.45; border: ${borderSize} solid #ffffff;"></div>`;
          break;

        case 'disputed':
          markerHtml = `<div class="${shapeClass} ${highlightRing} transition-all duration-150 flex items-center justify-center shadow-sm" style="width: ${sizePx}px; height: ${sizePx}px; background-color: #ffffff; border: 2.5px solid ${typeColor};">
            <div style="width: 4px; height: 4px; background-color: ${typeColor}; border-radius: 9999px;"></div>
          </div>`;
          break;

        case 'community':
          markerHtml = `<div class="${shapeClass} ${highlightRing} transition-all duration-150 flex items-center justify-center shadow-sm" style="width: ${sizePx}px; height: ${sizePx}px; background-color: #ffffff; border: 2.5px dashed ${typeColor};"></div>`;
          break;

        case 'retracted':
          markerHtml = `<div class="${shapeClass} ${highlightRing} transition-all duration-150 flex items-center justify-center shadow-sm" style="width: ${sizePx}px; height: ${sizePx}px; background-color: #ffffff; border: 3px solid #dc2626;">
            <div style="width: 4px; height: 4px; background-color: #dc2626; border-radius: 9999px;"></div>
          </div>`;
          break;
      }

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-incident-marker',
        iconSize: [sizePx, sizePx],
        iconAnchor: [sizePx / 2, sizePx / 2]
      });

      const marker = L.marker([incident.latitude, incident.longitude], { icon: customIcon });

      // Tooltip hover
      const tooltipContent = `
        <div class="p-1.5 max-w-xs text-slate-900 font-sans">
          <div class="flex items-center space-x-1.5 mb-1">
            <span class="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded text-white" style="background-color: ${typeColor}">
              ${incident.incidentType.replace('-', ' ')}
            </span>
            <span class="text-[10px] text-slate-500 font-mono">${incident.id}</span>
          </div>
          <div class="font-bold text-xs leading-tight mb-1">${incident.title}</div>
          <div class="text-[11px] text-slate-600 flex justify-between">
            <span>${incident.lga}, ${incident.state}</span>
            <span class="font-semibold text-slate-800">${incident.eventDate}</span>
          </div>
        </div>
      `;

      marker.bindTooltip(tooltipContent, {
        direction: 'top',
        offset: [0, -sizePx / 2],
        className: 'bg-white border border-slate-300 shadow-lg rounded p-0'
      });

      marker.on('click', () => onSelectIncident(incident));
      marker.on('mouseover', () => onHoverIncident(incident.id));
      marker.on('mouseout', () => onHoverIncident(null));

      markersGroupRef.current?.addLayer(marker);
    });
  }, [incidents, selectedIncident, hoveredIncidentId, filterState.viewMode]);

  return (
    <div className="relative w-full h-full min-h-[400px] bg-slate-100 flex-1 overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Map Surface Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-sm border border-slate-300 rounded shadow-md p-3 text-xs max-w-xs text-slate-800">
        <div className="font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1 flex items-center justify-between">
          <span className="flex items-center space-x-1">
            <Shield className="w-3.5 h-3.5 text-slate-700" />
            <span>Verification Legend</span>
          </span>
          <span className="text-[10px] font-mono text-slate-500">Aegis PRD v3.1</span>
        </div>

        <div className="space-y-1.5 mb-2.5">
          <div className="flex items-center space-x-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#1B2B48] border border-slate-900 inline-block shadow-sm"></span>
            <span className="font-medium text-slate-800">Corroborated</span>
            <span className="text-[10px] text-slate-500">(2+ Sources)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#1B2B48]/45 border border-slate-600 inline-block shadow-sm"></span>
            <span className="font-medium text-slate-800">Single-Source</span>
            <span className="text-[10px] text-slate-500">(40% Faded)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3.5 h-3.5 rounded-full border-1.5 border-slate-900 bg-white flex items-center justify-center inline-block">
              <span className="w-1 h-1 bg-slate-900 rounded-full"></span>
            </span>
            <span className="font-medium text-slate-800">Disputed</span>
            <span className="text-[10px] text-slate-500">(Hollow Solid)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3.5 h-3.5 rounded-full border-1.5 border-dashed border-slate-800 bg-white inline-block"></span>
            <span className="font-medium text-slate-800">Community</span>
            <span className="text-[10px] text-slate-500">(Hollow Dashed)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3.5 h-3.5 rounded-full border-2 border-red-600 bg-white inline-block"></span>
            <span className="font-medium text-slate-800">Retracted</span>
            <span className="text-[10px] text-red-600">(Red Ring)</span>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-2 text-[10px] text-slate-600 space-y-1">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 bg-slate-700 rounded-full inline-block"></span>
            <span>Circle = Exact Coordinate</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 bg-slate-700 inline-block transform rotate-45"></span>
            <span>Diamond/Square = Centroid Derived</span>
          </div>
        </div>
      </div>
    </div>
  );
};
