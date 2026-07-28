import React from 'react';
import { SecurityIncident, VerificationStatus, IncidentType } from '../types';
import { ChevronRight, ChevronLeft, Calendar, MapPin, ExternalLink, ShieldCheck, Filter, AlertCircle } from 'lucide-react';

interface FeedRailProps {
  incidents: SecurityIncident[];
  selectedIncident: SecurityIncident | null;
  hoveredIncidentId: string | null;
  onSelectIncident: (incident: SecurityIncident) => void;
  onHoverIncident: (id: string | null) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  dateRangePreset: string;
}

const STATUS_BADGES: Record<VerificationStatus, { label: string; bg: string; text: string; border: string }> = {
  'corroborated': { label: 'Corroborated', bg: 'bg-[#1B2B48]', text: 'text-white', border: 'border-[#1B2B48]' },
  'single-source': { label: 'Single Source', bg: 'bg-[#1B2B48]/15', text: 'text-slate-800', border: 'border-slate-400' },
  'disputed': { label: 'Disputed', bg: 'bg-amber-50', text: 'text-amber-900', border: 'border-amber-400' },
  'community': { label: 'Community', bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-dashed border-slate-400' },
  'retracted': { label: 'Retracted', bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-500' },
};

const TYPE_LABELS: Record<IncidentType, string> = {
  'armed-banditry': 'Armed Banditry',
  'insurgency-iswap': 'Insurgency / ISWAP',
  'farmer-herder': 'Farmer-Herder Conflict',
  'kidnapping': 'Kidnapping',
  'civil-unrest': 'Civil Unrest',
  'maritime-piracy': 'Maritime Piracy',
  'military-op': 'Military Operation',
};

export const FeedRail: React.FC<FeedRailProps> = ({
  incidents,
  selectedIncident,
  hoveredIncidentId,
  onSelectIncident,
  onHoverIncident,
  isCollapsed,
  onToggleCollapse,
  dateRangePreset
}) => {
  if (isCollapsed) {
    return (
      <div className="bg-white border-l border-slate-300 w-10 flex-none flex flex-col items-center py-3 z-20 shadow-md">
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition-colors mb-4"
          title="Expand Incident Feed Rail"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="rotate-90 whitespace-nowrap text-xs font-bold text-slate-800 tracking-wider flex items-center space-x-2 my-auto">
          <span>INCIDENT FEED</span>
          <span className="bg-[#041632] text-white text-[10px] px-2 py-0.5 rounded-full font-mono">
            {incidents.length}
          </span>
        </div>
      </div>
    );
  }

  return (
    <aside className="w-[360px] max-w-full bg-white border-l border-slate-300 flex flex-col flex-none z-20 shadow-lg h-full overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-slate-200 bg-[#f7f9fb] flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="font-bold text-sm text-slate-900 uppercase tracking-tight font-sans">
              Chronological Feed
            </h2>
            <span className="bg-[#041632] text-white font-mono text-[11px] font-bold px-2 py-0.5 rounded-full">
              {incidents.length}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Active Window: <span className="font-medium text-slate-700">{dateRangePreset === '30d' ? 'Most Recent 30 Days' : dateRangePreset}</span>
          </p>
        </div>

        <button
          onClick={onToggleCollapse}
          className="p-1 rounded hover:bg-slate-200 text-slate-600 transition-colors"
          title="Collapse Feed Rail"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Feed List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-slate-50">
        {incidents.length === 0 ? (
          <div className="p-6 text-center border-2 border-dashed border-slate-300 rounded bg-white">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="font-semibold text-sm text-slate-800">No Incidents Reported</h3>
            <p className="text-xs text-slate-600 mt-1">
              Zero security incidents were recorded in the active filter window. The platform does not backfill older events to maintain editorial accuracy.
            </p>
          </div>
        ) : (
          incidents.map((incident) => {
            const isSelected = selectedIncident?.id === incident.id;
            const isHovered = hoveredIncidentId === incident.id;
            const statusConfig = STATUS_BADGES[incident.verificationStatus];

            return (
              <div
                key={incident.id}
                onClick={() => onSelectIncident(incident)}
                onMouseEnter={() => onHoverIncident(incident.id)}
                onMouseLeave={() => onHoverIncident(null)}
                className={`p-3 rounded border transition-all cursor-pointer text-xs ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-amber-400'
                    : isHovered
                    ? 'bg-slate-100 border-slate-400 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Top Row: Type Tag & Status Badge */}
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span
                    className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded border ${
                      isSelected ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    {TYPE_LABELS[incident.incidentType] || incident.incidentType}
                  </span>

                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                  >
                    {statusConfig.label}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className={`font-bold text-xs leading-snug mb-1.5 ${
                    isSelected ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {incident.title}
                </h3>

                {/* Metadata Row */}
                <div
                  className={`flex items-center justify-between text-[11px] font-mono ${
                    isSelected ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{incident.lga}, {incident.state}</span>
                  </span>

                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{incident.eventDate}</span>
                  </span>
                </div>

                {/* Bottom Row: Source Count & Casualties */}
                <div
                  className={`mt-2 pt-1.5 border-t flex items-center justify-between text-[10px] ${
                    isSelected ? 'border-slate-800 text-slate-300' : 'border-slate-100 text-slate-500'
                  }`}
                >
                  <span className="font-mono">
                    ID: <strong className={isSelected ? 'text-amber-300' : 'text-slate-800'}>{incident.id}</strong>
                  </span>

                  <div className="flex items-center space-x-2">
                    {incident.fatalities > 0 && (
                      <span className="font-semibold text-red-600 dark:text-red-300">
                        {incident.fatalities} Fatalities
                      </span>
                    )}
                    <span>{incident.sources.length} Source{incident.sources.length > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};
