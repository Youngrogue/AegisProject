import React, { useState } from 'react';
import { SecurityIncident, VerificationStatus } from '../types';
import { X, ExternalLink, Calendar, MapPin, ShieldCheck, AlertTriangle, Clock, Copy, Check, FileText, Share2 } from 'lucide-react';
import { generateChicagoCitation, generateAPACitation, generateBibTeX } from '../utils/citation';

interface DetailPanelProps {
  incident: SecurityIncident;
  onClose: () => void;
  onCopyUpdateLink: (revisionId: string) => void;
}

const STATUS_DESCRIPTIONS: Record<VerificationStatus, { label: string; desc: string; badge: string }> = {
  'corroborated': {
    label: 'Corroborated',
    desc: 'Verified by two or more independent, credible published news or official investigative sources.',
    badge: 'bg-[#1B2B48] text-white border-[#1B2B48]'
  },
  'single-source': {
    label: 'Single-Source',
    desc: 'Sourced from a single credible reporting outlet. Uncorroborated by secondary media or official bulletins.',
    badge: 'bg-[#1B2B48]/15 text-slate-800 border-slate-400'
  },
  'disputed': {
    label: 'Disputed',
    desc: 'Published sources or official bulletins materially conflict on critical facts, casualty figures, or perpetrator identity.',
    badge: 'bg-amber-100 text-amber-900 border-amber-400'
  },
  'community': {
    label: 'Community Submitted',
    desc: 'Submitted via Aegis contributor portal. Curator-reviewed for OpSec & coordinate validity, pending source corroboration.',
    badge: 'bg-slate-100 text-slate-800 border-dashed border-slate-400'
  },
  'retracted': {
    label: 'Retracted Record',
    desc: 'Withdrawn following official investigation or publisher retraction. Retained permanently for audit trail transparency.',
    badge: 'bg-red-100 text-red-900 border-red-500'
  }
};

export const DetailPanel: React.FC<DetailPanelProps> = ({ incident, onClose, onCopyUpdateLink }) => {
  const [citationFormat, setCitationFormat] = useState<'chicago' | 'apa' | 'bibtex'>('chicago');
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [copiedUpdateId, setCopiedUpdateId] = useState<string | null>(null);

  const statusInfo = STATUS_DESCRIPTIONS[incident.verificationStatus];

  const getCitationText = () => {
    switch (citationFormat) {
      case 'chicago':
        return generateChicagoCitation(incident);
      case 'apa':
        return generateAPACitation(incident);
      case 'bibtex':
        return generateBibTeX(incident);
    }
  };

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(getCitationText());
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  const handleCopyUpdate = (revId: string) => {
    onCopyUpdateLink(revId);
    setCopiedUpdateId(revId);
    setTimeout(() => setCopiedUpdateId(null), 2000);
  };

  return (
    <aside className="w-[480px] max-w-full bg-white border-r border-slate-300 flex flex-col flex-none z-30 shadow-2xl h-full overflow-hidden absolute left-0 top-0 bottom-0">
      {/* Header Bar */}
      <div className="p-3.5 bg-[#041632] text-white flex items-start justify-between border-b border-slate-700">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-mono text-amber-300 text-xs font-bold bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
              {incident.id}
            </span>
            <span className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold">
              {incident.incidentType.replace('-', ' ')}
            </span>
          </div>
          <h2 className="font-bold text-base leading-snug font-sans text-slate-100">
            {incident.title}
          </h2>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-slate-800 text-slate-300 transition-colors"
          title="Close detail panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-slate-800 bg-slate-50/50">
        {/* Verification Status Card */}
        <div className={`p-3 rounded border ${statusInfo.badge} shadow-sm`}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-xs uppercase tracking-wide flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              Status: {statusInfo.label}
            </span>
            <span className="text-[10px] font-mono">
              Precision: {incident.precisionLevel.toUpperCase()}
            </span>
          </div>
          <p className="text-[11px] opacity-90 leading-relaxed">
            {statusInfo.desc}
          </p>
        </div>

        {/* Retraction / Dispute Notices */}
        {incident.verificationStatus === 'retracted' && incident.retractionReason && (
          <div className="p-3 bg-red-50 border border-red-300 text-red-900 rounded">
            <h4 className="font-bold text-xs flex items-center mb-1 text-red-800">
              <AlertTriangle className="w-4 h-4 mr-1.5 text-red-600" />
              Retraction Audit Record ({incident.retractedDate || 'Retracted'})
            </h4>
            <p className="text-[11px] leading-relaxed">{incident.retractionReason}</p>
          </div>
        )}

        {incident.verificationStatus === 'disputed' && incident.disputeReason && (
          <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 rounded">
            <h4 className="font-bold text-xs flex items-center mb-1 text-amber-800">
              <AlertTriangle className="w-4 h-4 mr-1.5 text-amber-600" />
              Nature of Facts Disputed
            </h4>
            <p className="text-[11px] leading-relaxed">{incident.disputeReason}</p>
          </div>
        )}

        {/* Event Location & Date Metadata */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-white border border-slate-200 rounded">
          <div>
            <span className="text-[10px] uppercase text-slate-500 font-semibold block mb-0.5">Location</span>
            <div className="font-bold text-slate-900 flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1 text-slate-500" />
              {incident.settlement}, {incident.lga} LGA
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">{incident.state} State, Nigeria</div>
          </div>

          <div>
            <span className="text-[10px] uppercase text-slate-500 font-semibold block mb-0.5">Event Date</span>
            <div className="font-bold text-slate-900 flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-slate-500" />
              {incident.eventDate}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Geocoded: {incident.latitude.toFixed(4)}, {incident.longitude.toFixed(4)}</div>
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-white border border-slate-200 rounded">
            <span className="text-[10px] uppercase text-slate-500 block font-semibold">Fatalities</span>
            <span className="font-bold text-sm text-red-700">{incident.fatalities}</span>
          </div>

          <div className="p-2 bg-white border border-slate-200 rounded">
            <span className="text-[10px] uppercase text-slate-500 block font-semibold">Injured</span>
            <span className="font-bold text-sm text-amber-700">{incident.injured}</span>
          </div>

          <div className="p-2 bg-white border border-slate-200 rounded">
            <span className="text-[10px] uppercase text-slate-500 block font-semibold">Abducted</span>
            <span className="font-bold text-sm text-purple-700">{incident.abducted}</span>
          </div>
        </div>

        {/* Platform Authored Summary */}
        <div className="p-3 bg-white border border-slate-200 rounded space-y-1">
          <h4 className="font-bold text-xs uppercase text-slate-700 tracking-wider">Platform-Authored Summary</h4>
          <p className="text-slate-800 leading-relaxed text-xs">
            {incident.summary}
          </p>
          <div className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-100">
            * Note: Aegis authors concise summaries from source materials to respect copyright and journal provenance.
          </div>
        </div>

        {/* Sources & Provenance */}
        <div className="p-3 bg-white border border-slate-200 rounded space-y-2">
          <h4 className="font-bold text-xs uppercase text-slate-700 tracking-wider">Source Provenance ({incident.sources.length})</h4>
          <div className="space-y-1.5">
            {incident.sources.map((src) => (
              <div key={src.id} className="p-2 bg-slate-50 border border-slate-200 rounded flex items-start justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-[11px] leading-snug">
                    {src.publisher} {src.isPrimary && <span className="bg-amber-100 text-amber-800 text-[9px] px-1 rounded ml-1 font-mono uppercase">Primary</span>}
                  </div>
                  <div className="text-[11px] text-slate-600 font-sans mt-0.5">"{src.title}"</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">Published: {src.publishedDate}</div>
                </div>

                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors ml-2"
                  title="Open outbound source URL"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Append-Only Update Timeline (§6.4) */}
        {incident.updates && incident.updates.length > 0 && (
          <div className="p-3 bg-white border border-slate-200 rounded space-y-2">
            <h4 className="font-bold text-xs uppercase text-slate-700 tracking-wider flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" />
              Post-Publication Update Timeline
            </h4>
            <div className="space-y-2 border-l-2 border-slate-300 pl-3 ml-1">
              {incident.updates.map((update) => (
                <div key={update.id} id={`rev-${update.id}`} className="relative pb-1">
                  <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-[#041632]"></div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mb-0.5">
                    <span>{update.date}</span>
                    <button
                      onClick={() => handleCopyUpdate(update.id)}
                      className="text-slate-600 hover:text-slate-900 flex items-center space-x-0.5"
                    >
                      {copiedUpdateId === update.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Share2 className="w-3 h-3" />}
                      <span>{copiedUpdateId === update.id ? 'Anchor Copied' : 'Link Revision'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-800 leading-snug">{update.summary}</p>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Curator Approval: <span className="font-medium text-slate-600">{update.curatorName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Academic Citation Block (§6.3 FR-DET-06) */}
        <div className="p-3 bg-slate-100 border border-slate-300 rounded space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs uppercase text-slate-700 flex items-center">
              <FileText className="w-3.5 h-3.5 mr-1" />
              Academic Citation Block
            </span>

            <div className="flex items-center space-x-1 text-[10px]">
              {(['chicago', 'apa', 'bibtex'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setCitationFormat(fmt)}
                  className={`px-1.5 py-0.5 rounded font-mono uppercase ${
                    citationFormat === fmt ? 'bg-[#041632] text-white font-bold' : 'bg-white text-slate-700 border border-slate-300'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          <div className="p-2 bg-white border border-slate-300 rounded font-mono text-[11px] text-slate-800 select-all leading-relaxed">
            {getCitationText()}
          </div>

          <button
            onClick={handleCopyCitation}
            className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors"
          >
            {copiedCitation ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCitation ? 'Citation Copied' : 'Copy Academic Citation'}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
