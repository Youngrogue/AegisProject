import React from 'react';
import { CommunitySubmission } from '../types';
import { X, UserCheck, CheckCircle2, XCircle, Clock, MapPin, ExternalLink, Shield } from 'lucide-react';

interface CuratorQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  submissions: CommunitySubmission[];
  onApprove: (id: string, publishAsCorroborated: boolean) => void;
  onReject: (id: string) => void;
}

export const CuratorQueueModal: React.FC<CuratorQueueModalProps> = ({
  isOpen,
  onClose,
  submissions,
  onApprove,
  onReject
}) => {
  if (!isOpen) return null;

  const pendingList = submissions.filter((s) => s.status === 'pending');

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans text-xs">
      <div className="bg-white border border-slate-300 rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-3.5 bg-[#041632] text-white flex items-center justify-between border-b border-slate-700">
          <div>
            <h2 className="font-bold text-sm leading-tight flex items-center">
              <UserCheck className="w-4 h-4 mr-2 text-amber-400" />
              Aegis Editorial & Curator Review Queue
            </h2>
            <p className="text-[11px] text-slate-300">
              Reviewing pending community submissions & post-publication updates
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-800 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List Body */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-slate-50">
          {pendingList.length === 0 ? (
            <div className="p-8 text-center bg-white border border-slate-200 rounded">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <h3 className="font-bold text-slate-900 text-sm">Curator Queue Empty</h3>
              <p className="text-slate-600 text-xs mt-1">
                All submitted community incidents and updates have been reviewed and processed.
              </p>
            </div>
          ) : (
            pendingList.map((sub) => (
              <div key={sub.id} className="p-3.5 bg-white border border-slate-300 rounded shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] bg-slate-100 text-slate-800 font-bold px-1.5 py-0.5 rounded border border-slate-200">
                    ID: {sub.id}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Submitted: {sub.submittedAt}
                  </span>
                </div>

                <div className="font-bold text-slate-900 text-xs">
                  {sub.incidentType.replace('-', ' ').toUpperCase()} — {sub.settlement}, {sub.lga} ({sub.state})
                </div>

                <p className="text-slate-800 text-xs leading-relaxed bg-slate-50 p-2 rounded border border-slate-200">
                  {sub.description}
                </p>

                {sub.sourceUrls && sub.sourceUrls.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase block">Submitted Sources:</span>
                    {sub.sourceUrls.map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-800 hover:underline flex items-center space-x-1 font-mono text-[10px]"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span className="truncate">{url}</span>
                      </a>
                    ))}
                  </div>
                )}

                {/* Curator Actions */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <button
                    onClick={() => onReject(sub.id)}
                    className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-900 font-semibold rounded flex items-center space-x-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject Report</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onApprove(sub.id, false)}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded flex items-center space-x-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Approve as 'Community'</span>
                    </button>

                    <button
                      onClick={() => onApprove(sub.id, true)}
                      className="px-3 py-1 bg-[#041632] hover:bg-slate-800 text-white font-bold rounded flex items-center space-x-1 shadow-sm"
                    >
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Promote to 'Corroborated'</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
