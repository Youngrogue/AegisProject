import React, { useState } from 'react';
import { SecurityIncident } from '../types';
import { X, Download, FileCode, Table, Check } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidents: SecurityIncident[];
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, incidents }) => {
  const [format, setFormat] = useState<'geojson' | 'csv'>('geojson');
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    let content = '';
    let filename = `aegis-security-incidents-${new Date().toISOString().split('T')[0]}`;
    let mimeType = '';

    if (format === 'geojson') {
      const geojson = {
        type: 'FeatureCollection',
        metadata: {
          platform: 'Aegis Institutional Security Platform',
          exportedAt: new Date().toISOString(),
          recordCount: incidents.length,
          citation: 'Aegis Institutional. Nigeria Security Incident Mapping Dataset (2026).'
        },
        features: incidents.map((inc) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [inc.longitude, inc.latitude]
          },
          properties: {
            id: inc.id,
            title: inc.title,
            incidentType: inc.incidentType,
            verificationStatus: inc.verificationStatus,
            precisionLevel: inc.precisionLevel,
            eventDate: inc.eventDate,
            state: inc.state,
            lga: inc.lga,
            settlement: inc.settlement,
            fatalities: inc.fatalities,
            injured: inc.injured,
            abducted: inc.abducted,
            summary: inc.summary,
            sources: inc.sources.map((s) => s.url).join('; ')
          }
        }))
      };
      content = JSON.stringify(geojson, null, 2);
      filename += '.geojson';
      mimeType = 'application/json';
    } else {
      const headers = ['ID', 'Title', 'Type', 'Status', 'Precision', 'Event Date', 'State', 'LGA', 'Fatalities', 'Abducted', 'Latitude', 'Longitude', 'Sources'];
      const rows = incidents.map((inc) => [
        inc.id,
        `"${inc.title.replace(/"/g, '""')}"`,
        inc.incidentType,
        inc.verificationStatus,
        inc.precisionLevel,
        inc.eventDate,
        inc.state,
        inc.lga,
        inc.fatalities,
        inc.abducted,
        inc.latitude,
        inc.longitude,
        `"${inc.sources.map((s) => s.url).join('; ')}"`
      ]);

      content = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      filename += '.csv';
      mimeType = 'text/csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans text-xs">
      <div className="bg-white border border-slate-300 rounded-lg shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-3.5 bg-[#041632] text-white flex items-center justify-between border-b border-slate-700">
          <h2 className="font-bold text-sm leading-tight flex items-center">
            <Download className="w-4 h-4 mr-2 text-amber-400" />
            Export Filtered Dataset ({incidents.length} Records)
          </h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-800 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 bg-slate-50">
          <p className="text-slate-700 text-xs">
            Export the currently filtered security incident records with complete source provenance, verification statuses, and geocoding precision metadata.
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setFormat('geojson')}
              className={`p-3 rounded border text-left flex flex-col justify-between transition-all ${
                format === 'geojson'
                  ? 'bg-[#041632] text-white border-[#041632] shadow-md'
                  : 'bg-white text-slate-800 border-slate-300 hover:border-slate-400'
              }`}
            >
              <FileCode className="w-5 h-5 mb-2 text-amber-400" />
              <div>
                <div className="font-bold text-xs">GeoJSON Format</div>
                <div className="text-[10px] opacity-80 mt-0.5">Spatial GIS & MapLibre / QGIS ready</div>
              </div>
            </button>

            <button
              onClick={() => setFormat('csv')}
              className={`p-3 rounded border text-left flex flex-col justify-between transition-all ${
                format === 'csv'
                  ? 'bg-[#041632] text-white border-[#041632] shadow-md'
                  : 'bg-white text-slate-800 border-slate-300 hover:border-slate-400'
              }`}
            >
              <Table className="w-5 h-5 mb-2 text-amber-400" />
              <div>
                <div className="font-bold text-xs">CSV Spreadsheet</div>
                <div className="text-[10px] opacity-80 mt-0.5">Excel / R / Python Pandas analysis</div>
              </div>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded"
            >
              Cancel
            </button>

            <button
              onClick={handleDownload}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded flex items-center space-x-1.5 shadow-sm"
            >
              {downloaded ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
              <span>{downloaded ? 'Downloaded' : `Download ${format.toUpperCase()}`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
