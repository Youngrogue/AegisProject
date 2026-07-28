import React from 'react';
import { X, ShieldCheck, BookOpen, AlertTriangle, Scale, Lock, Database } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans text-xs">
      <div className="bg-white border border-slate-300 rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-3.5 bg-[#041632] text-white flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="font-bold text-sm leading-tight">
                Aegis Institutional Methodology & Verification Standards
              </h2>
              <p className="text-[11px] text-slate-300">
                PRD v3.1 Standards for Editorial Integrity, Geocoding Precision & OpSec
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-800 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-800 leading-relaxed bg-slate-50">
          {/* Core Institutional Philosophy */}
          <section className="p-3.5 bg-white border border-slate-300 rounded space-y-1.5">
            <h3 className="font-bold text-sm text-[#041632] flex items-center">
              <Scale className="w-4 h-4 mr-1.5 text-amber-600" />
              1. Institutional Commitment & Non-Editorialization
            </h3>
            <p className="text-xs text-slate-700">
              Aegis is an open-source, neutral mapping platform designed for human rights observers, academic researchers, and news organizations. The platform enforces strict editorial integrity: every record stores its verification status, links directly to primary sources, and refrains from AI narrative synthesis or composite threat scores.
            </p>
          </section>

          {/* Verification Status Model */}
          <section className="p-3.5 bg-white border border-slate-300 rounded space-y-2">
            <h3 className="font-bold text-sm text-[#041632] flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-slate-800" />
              2. The Five Verification States (Inviolable Rules)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-slate-100 border border-slate-300 rounded">
                <span className="font-bold text-slate-900 block mb-0.5">1. Corroborated (Solid Fill)</span>
                <p className="text-[11px] text-slate-600">Requires 2 or more independent, verified published news or official investigative sources confirming core facts.</p>
              </div>

              <div className="p-2 bg-slate-100 border border-slate-300 rounded">
                <span className="font-bold text-slate-900 block mb-0.5">2. Single-Source (40% Faded Fill)</span>
                <p className="text-[11px] text-slate-600">Sourced from a single credible media report or press release, uncorroborated by secondary outlets.</p>
              </div>

              <div className="p-2 bg-slate-100 border border-slate-300 rounded">
                <span className="font-bold text-slate-900 block mb-0.5">3. Disputed (Hollow Solid Outline)</span>
                <p className="text-[11px] text-slate-600">Published sources materially conflict regarding casualty counts, perpetrator group, or sequence of events.</p>
              </div>

              <div className="p-2 bg-slate-100 border border-slate-300 rounded">
                <span className="font-bold text-slate-900 block mb-0.5">4. Community (Hollow Dashed Outline)</span>
                <p className="text-[11px] text-slate-600">Submitted via contributor portal, curator-reviewed for OpSec & coordinate validity, pending news corroboration.</p>
              </div>
            </div>

            <div className="p-2 bg-red-50 border border-red-300 rounded text-red-950">
              <span className="font-bold block mb-0.5">5. Retracted (Red Ring Outline)</span>
              <p className="text-[11px]">
                Previously published records withdrawn following official investigation or publisher retraction. Retracted records are never deleted; they remain permanently accessible for audit trail transparency (FR-VER-03).
              </p>
            </div>
          </section>

          {/* Geocoding & Precision Hierarchy */}
          <section className="p-3.5 bg-white border border-slate-300 rounded space-y-1.5">
            <h3 className="font-bold text-sm text-[#041632] flex items-center">
              <Database className="w-4 h-4 mr-1.5 text-slate-800" />
              3. Geocoding Precision Hierarchy
            </h3>
            <p className="text-xs text-slate-700">
              To prevent misrepresenting centroid-derived coordinates as exact locations, Aegis classifies every record into one of three precision levels:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 font-mono">
              <li><strong>Exact Coordinates:</strong> Specific landmark, road intersection, or documented coordinate.</li>
              <li><strong>Settlement Centroid:</strong> Geocoded to town or village center (represented by square marker).</li>
              <li><strong>LGA Centroid:</strong> Geocoded to Local Government Area administrative centroid when specific village is unknown.</li>
            </ul>
          </section>

          {/* Contributor Safety & OpSec */}
          <section className="p-3.5 bg-white border border-slate-300 rounded space-y-1.5">
            <h3 className="font-bold text-sm text-[#041632] flex items-center">
              <Lock className="w-4 h-4 mr-1.5 text-amber-600" />
              4. Contributor Safety & Ethics (FR-ETH-01..08)
            </h3>
            <p className="text-xs text-slate-700">
              The platform collects no personally identifying information (PII). IP addresses are not recorded in association with community submissions. Names of victims, witnesses, or private residences are excluded from published summaries to prevent harm.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
