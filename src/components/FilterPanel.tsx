import React, { useState } from 'react';
import { FilterState, IncidentType, VerificationStatus, PrecisionLevel } from '../types';
import { Filter, Search, RotateCcw, ChevronUp, ChevronDown, Layers, Calendar, Check, Shield } from 'lucide-react';

interface FilterPanelProps {
  filterState: FilterState;
  onFilterChange: (newState: FilterState) => void;
  onClearFilters: () => void;
}

const ALL_TYPES: { id: IncidentType; label: string; color: string }[] = [
  { id: 'armed-banditry', label: 'Armed Banditry', color: '#d97706' },
  { id: 'insurgency-iswap', label: 'Insurgency / ISWAP', color: '#991b1b' },
  { id: 'farmer-herder', label: 'Farmer-Herder Conflict', color: '#15803d' },
  { id: 'kidnapping', label: 'Kidnapping for Ransom', color: '#6d28d9' },
  { id: 'civil-unrest', label: 'Civil Unrest & Protests', color: '#2563eb' },
  { id: 'maritime-piracy', label: 'Maritime Piracy', color: '#0d9488' },
  { id: 'military-op', label: 'Military Operation', color: '#0f172a' },
];

const ALL_STATUSES: { id: VerificationStatus; label: string }[] = [
  { id: 'corroborated', label: 'Corroborated (2+ Sources)' },
  { id: 'single-source', label: 'Single-Source' },
  { id: 'disputed', label: 'Disputed' },
  { id: 'community', label: 'Community Submitted' },
  { id: 'retracted', label: 'Retracted Records' },
];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filterState,
  onFilterChange,
  onClearFilters
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [typeSearch, setTypeSearch] = useState('');

  const toggleIncidentType = (type: IncidentType) => {
    const current = filterState.incidentTypes;
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    onFilterChange({ ...filterState, incidentTypes: updated });
  };

  const toggleVerificationStatus = (status: VerificationStatus) => {
    const current = filterState.verificationStatuses;
    const updated = current.includes(status)
      ? current.filter((s) => s !== status)
      : [...current, status];
    onFilterChange({ ...filterState, verificationStatuses: updated });
  };

  const setDatePreset = (preset: FilterState['dateRangePreset']) => {
    onFilterChange({ ...filterState, dateRangePreset: preset });
  };

  const filteredTypesList = ALL_TYPES.filter((t) =>
    t.label.toLowerCase().includes(typeSearch.toLowerCase())
  );

  // Calculate active filter count
  const activeCount =
    (filterState.incidentTypes.length < ALL_TYPES.length ? ALL_TYPES.length - filterState.incidentTypes.length : 0) +
    (filterState.verificationStatuses.length < ALL_STATUSES.length ? ALL_STATUSES.length - filterState.verificationStatuses.length : 0) +
    (filterState.dateRangePreset !== '30d' ? 1 : 0) +
    (filterState.showBoundaryState ? 1 : 0) +
    (filterState.viewMode !== 'markers' ? 1 : 0);

  return (
    <div className="absolute top-3 right-3 z-30 max-w-sm w-80 font-sans text-xs">
      {/* Collapsed Control Button */}
      <div className="bg-white/95 backdrop-blur border border-slate-300 rounded-md shadow-lg overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-2.5 flex items-center justify-between text-slate-900 font-bold bg-[#f7f9fb] hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-[#041632]" />
            <span>Layer & Filter Controls</span>
            {activeCount > 0 && (
              <span className="bg-amber-500 text-slate-950 font-bold text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                {activeCount} active
              </span>
            )}
          </div>
          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>

        {isOpen && (
          <div className="p-3 space-y-3 max-h-[80vh] overflow-y-auto border-t border-slate-200 bg-white">
            {/* Clear All Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Filter Parameters
              </span>
              <button
                onClick={onClearFilters}
                className="text-[11px] text-amber-700 font-semibold hover:underline flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            </div>

            {/* Time Window Presets */}
            <div>
              <label className="font-bold text-slate-800 block mb-1 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-slate-600" />
                Date Range Presets
              </label>
              <div className="grid grid-cols-5 gap-1 text-[11px]">
                {(['7d', '30d', '90d', '1y', 'all'] as const).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setDatePreset(preset)}
                    className={`py-1 rounded font-semibold transition-colors uppercase ${
                      filterState.dateRangePreset === preset
                        ? 'bg-[#041632] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* View Mode Toggle */}
            <div>
              <label className="font-bold text-slate-800 block mb-1 flex items-center">
                <Layers className="w-3.5 h-3.5 mr-1 text-slate-600" />
                Map Visualization Mode
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <button
                  onClick={() => onFilterChange({ ...filterState, viewMode: 'markers' })}
                  className={`py-1.5 px-2 rounded font-semibold transition-colors border ${
                    filterState.viewMode === 'markers'
                      ? 'bg-[#041632] text-white border-[#041632]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Point Markers
                </button>
                <button
                  onClick={() => onFilterChange({ ...filterState, viewMode: 'choropleth' })}
                  className={`py-1.5 px-2 rounded font-semibold transition-colors border ${
                    filterState.viewMode === 'choropleth'
                      ? 'bg-[#041632] text-white border-[#041632]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  State Choropleth
                </button>
              </div>
            </div>

            {/* Incident Types Filter */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-800 flex items-center">
                  <Shield className="w-3.5 h-3.5 mr-1 text-slate-600" />
                  Incident Category
                </label>
                <span className="text-[10px] text-slate-500 font-mono">
                  {filterState.incidentTypes.length}/{ALL_TYPES.length} Selected
                </span>
              </div>

              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={typeSearch}
                  onChange={(e) => setTypeSearch(e.target.value)}
                  className="w-full pl-7 pr-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                {filteredTypesList.map((type) => {
                  const isChecked = filterState.incidentTypes.includes(type.id);
                  return (
                    <label
                      key={type.id}
                      onClick={() => toggleIncidentType(type.id)}
                      className="flex items-center justify-between p-1 rounded hover:bg-slate-50 cursor-pointer text-slate-800"
                    >
                      <div className="flex items-center space-x-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block"
                          style={{ backgroundColor: type.color }}
                        ></span>
                        <span className="font-medium text-xs">{type.label}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Verification Status Filter */}
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Verification Status Filter
              </label>
              <div className="space-y-1">
                {ALL_STATUSES.map((status) => {
                  const isChecked = filterState.verificationStatuses.includes(status.id);
                  return (
                    <label
                      key={status.id}
                      onClick={() => toggleVerificationStatus(status.id)}
                      className="flex items-center justify-between p-1 rounded hover:bg-slate-50 cursor-pointer text-slate-800 text-xs"
                    >
                      <span className="font-medium">{status.label}</span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Overlay Boundaries Toggle */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center justify-between cursor-pointer p-1 rounded hover:bg-slate-50">
                <span className="font-bold text-slate-800">Show State Boundaries</span>
                <input
                  type="checkbox"
                  checked={filterState.showBoundaryState}
                  onChange={(e) =>
                    onFilterChange({ ...filterState, showBoundaryState: e.target.checked })
                  }
                  className="rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
