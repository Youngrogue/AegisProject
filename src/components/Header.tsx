import React from 'react';
import { Shield, Share2, Download, BookOpen, Send, RotateCcw, Check, UserCheck } from 'lucide-react';

interface HeaderProps {
  onOpenSubmission: () => void;
  onOpenCuratorQueue: () => void;
  onOpenMethodology: () => void;
  onOpenExport: () => void;
  onResetView: () => void;
  onCopyShareLink: () => void;
  pendingSubmissionsCount: number;
  copiedLink: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSubmission,
  onOpenCuratorQueue,
  onOpenMethodology,
  onOpenExport,
  onResetView,
  onCopyShareLink,
  pendingSubmissionsCount,
  copiedLink
}) => {
  return (
    <header className="bg-[#041632] text-white border-b border-slate-700 shadow-sm z-30 flex-none">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left Branding */}
        <div className="flex items-center space-x-3">
          <div className="bg-slate-800 p-2 rounded border border-slate-700 flex items-center justify-center text-amber-400 shadow-inner">
            <Shield className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-lg leading-tight tracking-tight text-slate-100 font-sans">
                Aegis Institutional
              </h1>
              <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded tracking-wider">
                Nigeria Security Mapping
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              Public Verification & Source Provenance Index
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <button
            onClick={onResetView}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
            title="Reset map view to Nigeria viewport"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset View</span>
          </button>

          <button
            onClick={onCopyShareLink}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded transition-colors border ${
              copiedLink
                ? 'bg-emerald-800 text-emerald-100 border-emerald-600'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="Copy URL permalink with active view and filters"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied' : 'Share View'}</span>
          </button>

          <button
            onClick={onOpenExport}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          <button
            onClick={onOpenMethodology}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Methodology</span>
          </button>

          <button
            onClick={onOpenCuratorQueue}
            className="relative flex items-center space-x-1.5 px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-200 transition-colors border border-slate-700 font-medium"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Curator Queue</span>
            {pendingSubmissionsCount > 0 && (
              <span className="bg-amber-500 text-slate-950 font-bold text-[10px] px-1.5 py-0.2 rounded-full ml-1">
                {pendingSubmissionsCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenSubmission}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold transition-colors shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Report</span>
          </button>
        </div>
      </div>
    </header>
  );
};
