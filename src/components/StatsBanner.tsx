import React from 'react';
import { SecurityIncident, VerificationStatus } from '../types';
import { ShieldCheck, HelpCircle, AlertTriangle, Users, FileX, Info } from 'lucide-react';

interface StatsBannerProps {
  incidents: SecurityIncident[];
  datePresetLabel: string;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({ incidents, datePresetLabel }) => {
  const total = incidents.length;
  
  const countByStatus = (status: VerificationStatus) =>
    incidents.filter((inc) => inc.verificationStatus === status).length;

  const corroboratedCount = countByStatus('corroborated');
  const singleSourceCount = countByStatus('single-source');
  const disputedCount = countByStatus('disputed');
  const communityCount = countByStatus('community');
  const retractedCount = countByStatus('retracted');

  const totalFatalities = incidents.reduce((acc, curr) => acc + (curr.fatalities || 0), 0);
  const totalAbducted = incidents.reduce((acc, curr) => acc + (curr.abducted || 0), 0);

  return (
    <div className="bg-[#eceef0] border-b border-slate-300 text-slate-800 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 z-20 shadow-inner">
      <div className="flex items-center space-x-2">
        <span className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] flex items-center">
          <Info className="w-3.5 h-3.5 mr-1 text-slate-600" />
          Active Window ({datePresetLabel}):
        </span>
        <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300">
          {total} Reported Incidents
        </span>
      </div>

      {/* Verification Breakdown */}
      <div className="flex items-center flex-wrap gap-x-4 gap-y-1">
        <div className="flex items-center space-x-1" title="Corroborated by 2+ independent sources">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1B2B48] inline-block"></span>
          <span className="font-medium text-slate-700">Corroborated:</span>
          <span className="font-bold text-slate-900">{corroboratedCount}</span>
        </div>

        <div className="flex items-center space-x-1" title="Single source, credible but uncorroborated">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1B2B48]/40 border border-slate-500 inline-block"></span>
          <span className="font-medium text-slate-700">Single Source:</span>
          <span className="font-bold text-slate-900">{singleSourceCount}</span>
        </div>

        <div className="flex items-center space-x-1" title="Sources materially conflict on facts">
          <span className="w-2.5 h-2.5 rounded-full border-1.5 border-slate-800 bg-transparent inline-block"></span>
          <span className="font-medium text-slate-700">Disputed:</span>
          <span className="font-bold text-amber-800">{disputedCount}</span>
        </div>

        <div className="flex items-center space-x-1" title="Community submitted, curator reviewed">
          <span className="w-2.5 h-2.5 rounded-full border-1.5 border-dashed border-slate-700 bg-transparent inline-block"></span>
          <span className="font-medium text-slate-700">Community:</span>
          <span className="font-bold text-slate-900">{communityCount}</span>
        </div>

        {retractedCount > 0 && (
          <div className="flex items-center space-x-1" title="Retracted record retained for audit transparency">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-red-600 bg-transparent inline-block"></span>
            <span className="font-medium text-red-700">Retracted:</span>
            <span className="font-bold text-red-800">{retractedCount}</span>
          </div>
        )}
      </div>

      {/* Reported Impact Factual Totals */}
      <div className="flex items-center space-x-4 border-l border-slate-300 pl-4 text-slate-700">
        <div>
          <span>Reported Fatalities: </span>
          <span className="font-bold text-slate-900">{totalFatalities}</span>
        </div>
        <div>
          <span>Reported Abductions: </span>
          <span className="font-bold text-slate-900">{totalAbducted}</span>
        </div>
      </div>
    </div>
  );
};
