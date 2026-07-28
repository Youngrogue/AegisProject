import React, { useState } from 'react';
import { IncidentType, CommunitySubmission } from '../types';
import { X, ShieldAlert, Send, MapPin, Link2, Info } from 'lucide-react';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (submission: Omit<CommunitySubmission, 'id' | 'submittedAt' | 'status'>) => void;
}

export const SubmissionModal: React.FC<SubmissionModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [eventDate, setEventDate] = useState('2026-07-22');
  const [stateName, setStateName] = useState('Kaduna');
  const [lgaName, setLgaName] = useState('Kachia');
  const [settlement, setSettlement] = useState('');
  const [latitude, setLatitude] = useState('9.8712');
  const [longitude, setLongitude] = useState('7.9541');
  const [incidentType, setIncidentType] = useState<IncidentType>('kidnapping');
  const [description, setDescription] = useState('');
  const [sourceUrls, setSourceUrls] = useState('');
  const [contributorNotes, setContributorNotes] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    onSubmit({
      eventDate,
      state: stateName,
      lga: lgaName,
      settlement: settlement || `${lgaName} Sector`,
      latitude: parseFloat(latitude) || 9.87,
      longitude: parseFloat(longitude) || 7.95,
      incidentType,
      description,
      sourceUrls: sourceUrls.split('\n').filter((url) => url.trim().length > 0),
      contributorNotes
    });

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans text-xs">
      <div className="bg-white border border-slate-300 rounded-lg shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-3.5 bg-[#041632] text-white flex items-center justify-between border-b border-slate-700">
          <div>
            <h2 className="font-bold text-sm leading-tight flex items-center">
              <Send className="w-4 h-4 mr-2 text-amber-400" />
              Community Incident Submission Portal
            </h2>
            <p className="text-[11px] text-slate-300">
              Anonymous submission pathway into Aegis curator moderation queue
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-800 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-3.5 flex-1 bg-slate-50">
          {/* OpSec Guidance Banner */}
          <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 rounded">
            <h4 className="font-bold text-xs flex items-center mb-1 text-amber-900">
              <ShieldAlert className="w-4 h-4 mr-1.5 text-amber-600" />
              Contributor Operational Security (OpSec) Notice
            </h4>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] opacity-90">
              <li>Do NOT include names of individual victims, witnesses, or private residents.</li>
              <li>Do NOT report exact coordinates for private homes or non-public structures.</li>
              <li>No IP address is associated or logged with your submission.</li>
            </ul>
          </div>

          {submittedSuccess ? (
            <div className="p-6 text-center bg-emerald-50 border border-emerald-300 rounded text-emerald-900 my-4">
              <h3 className="font-bold text-sm mb-1">Report Received Successfully</h3>
              <p className="text-xs">
                Your report has been submitted to the Aegis Curator Queue. Upon review and OpSec verification, it will publish with 'Community' status.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Event Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                    className="w-full p-2 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-slate-800"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Incident Category</label>
                  <select
                    value={incidentType}
                    onChange={(e) => setIncidentType(e.target.value as IncidentType)}
                    className="w-full p-2 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-slate-800"
                  >
                    <option value="armed-banditry">Armed Banditry</option>
                    <option value="insurgency-iswap">Insurgency / ISWAP</option>
                    <option value="farmer-herder">Farmer-Herder Conflict</option>
                    <option value="kidnapping">Kidnapping for Ransom</option>
                    <option value="civil-unrest">Civil Unrest / Protests</option>
                    <option value="maritime-piracy">Maritime Piracy</option>
                    <option value="military-op">Military Operation</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">State</label>
                  <input
                    type="text"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    required
                    placeholder="e.g. Kaduna"
                    className="w-full p-2 bg-white border border-slate-300 rounded text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">LGA</label>
                  <input
                    type="text"
                    value={lgaName}
                    onChange={(e) => setLgaName(e.target.value)}
                    required
                    placeholder="e.g. Kachia"
                    className="w-full p-2 bg-white border border-slate-300 rounded text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Town / Sector</label>
                  <input
                    type="text"
                    value={settlement}
                    onChange={(e) => setSettlement(e.target.value)}
                    placeholder="e.g. Crossing Town"
                    className="w-full p-2 bg-white border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Latitude (Dec Deg)</label>
                  <input
                    type="text"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="9.8712"
                    className="w-full p-2 bg-white border border-slate-300 rounded text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Longitude (Dec Deg)</label>
                  <input
                    type="text"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="7.9541"
                    className="w-full p-2 bg-white border border-slate-300 rounded text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Summary Description of Events</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  required
                  placeholder="Factual narrative of event observed or reported..."
                  className="w-full p-2 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-slate-800"
                ></textarea>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Supporting Source URLs (One per line)</label>
                <textarea
                  value={sourceUrls}
                  onChange={(e) => setSourceUrls(e.target.value)}
                  rows={2}
                  placeholder="https://... news report link or public bulletin"
                  className="w-full p-2 bg-white border border-slate-300 rounded text-xs font-mono"
                ></textarea>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center space-x-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit to Queue</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
