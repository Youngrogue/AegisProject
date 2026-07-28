import React, { useState, useEffect, useMemo } from 'react';
import { SecurityIncident, FilterState, MapViewState, CommunitySubmission } from './types';
import { INITIAL_INCIDENTS } from './data/mockIncidents';
import { Header } from './components/Header';
import { StatsBanner } from './components/StatsBanner';
import { MapContainer } from './components/MapContainer';
import { FeedRail } from './components/FeedRail';
import { DetailPanel } from './components/DetailPanel';
import { FilterPanel } from './components/FilterPanel';
import { SubmissionModal } from './components/SubmissionModal';
import { CuratorQueueModal } from './components/CuratorQueueModal';
import { MethodologyModal } from './components/MethodologyModal';
import { ExportModal } from './components/ExportModal';
import { parseUrlState, updateUrlState } from './utils/urlState';

const DEFAULT_NIGERIA_VIEW: MapViewState = {
  latitude: 9.0820,
  longitude: 8.6753,
  zoom: 6,
};

const DEFAULT_FILTERS: FilterState = {
  incidentTypes: [
    'armed-banditry',
    'insurgency-iswap',
    'farmer-herder',
    'kidnapping',
    'civil-unrest',
    'maritime-piracy',
    'military-op',
  ],
  verificationStatuses: [
    'corroborated',
    'single-source',
    'disputed',
    'community',
    'retracted',
  ],
  dateRangePreset: '30d',
  searchQuery: '',
  precisionLevels: ['exact', 'settlement-centroid', 'lga-centroid'],
  showBoundaryState: true,
  showBoundaryLGA: false,
  viewMode: 'markers',
  mapStyle: 'light',
};

export default function App() {
  const [incidents, setIncidents] = useState<SecurityIncident[]>(INITIAL_INCIDENTS);
  const [communitySubmissions, setCommunitySubmissions] = useState<CommunitySubmission[]>([
    {
      id: 'SUB-8402',
      submittedAt: '2026-07-23 14:20',
      eventDate: '2026-07-22',
      state: 'Kaduna',
      lga: 'Giwa',
      settlement: 'Yakawada Village',
      latitude: 11.0821,
      longitude: 7.2312,
      incidentType: 'armed-banditry',
      description: 'Community vigilantes reported armed night raid on agrarian settlement. 2 residents abducted before security patrol intervention.',
      sourceUrls: ['https://dailytrust.com/kaduna-giwa-community-submission'],
      status: 'pending'
    }
  ]);

  const [mapViewState, setMapViewState] = useState<MapViewState>(DEFAULT_NIGERIA_VIEW);
  const [filterState, setFilterState] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedIncident, setSelectedIncident] = useState<SecurityIncident | null>(null);
  const [hoveredIncidentId, setHoveredIncidentId] = useState<string | null>(null);
  const [feedCollapsed, setFeedCollapsed] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Modals
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);
  const [isCuratorQueueOpen, setIsCuratorQueueOpen] = useState(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // On Mount: Parse initial URL hash/query
  useEffect(() => {
    const initialState = parseUrlState();
    if (initialState.mapView) {
      setMapViewState((prev) => ({ ...prev, ...initialState.mapView }));
    }
    if (initialState.selectedIncidentId) {
      const found = INITIAL_INCIDENTS.find((i) => i.id === initialState.selectedIncidentId);
      if (found) setSelectedIncident(found);
    }
    if (initialState.feedCollapsed) {
      setFeedCollapsed(true);
    }
    if (initialState.filters) {
      setFilterState((prev) => ({ ...prev, ...initialState.filters }));
    }
  }, []);

  // Synchronize URL State on change
  useEffect(() => {
    updateUrlState(mapViewState, selectedIncident?.id, feedCollapsed, filterState);
  }, [mapViewState, selectedIncident, feedCollapsed, filterState]);

  // Filtered Incidents Computation (FR-FEED-05 Date Window & Category Filtering)
  const filteredIncidents = useMemo(() => {
    const today = new Date('2026-07-23'); // Reference current platform date
    let cutoffDate: Date | null = new Date('2026-06-23'); // Default 30d

    if (filterState.dateRangePreset === '7d') {
      cutoffDate = new Date(today);
      cutoffDate.setDate(cutoffDate.getDate() - 7);
    } else if (filterState.dateRangePreset === '30d') {
      cutoffDate = new Date(today);
      cutoffDate.setDate(cutoffDate.getDate() - 30);
    } else if (filterState.dateRangePreset === '90d') {
      cutoffDate = new Date(today);
      cutoffDate.setDate(cutoffDate.getDate() - 90);
    } else if (filterState.dateRangePreset === '1y') {
      cutoffDate = new Date(today);
      cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);
    } else if (filterState.dateRangePreset === 'all') {
      cutoffDate = null;
    }

    return incidents.filter((incident) => {
      // Incident Type match
      if (!filterState.incidentTypes.includes(incident.incidentType)) return false;

      // Verification Status match
      if (!filterState.verificationStatuses.includes(incident.verificationStatus)) return false;

      // Date Window match
      if (cutoffDate) {
        const incDate = new Date(incident.eventDate);
        if (incDate < cutoffDate) return false;
      }

      return true;
    });
  }, [incidents, filterState]);

  // Handle Incident Selection (Pans map and opens detail panel)
  const handleSelectIncident = (incident: SecurityIncident) => {
    setSelectedIncident(incident);
    setMapViewState((prev) => ({
      latitude: incident.latitude,
      longitude: incident.longitude,
      zoom: Math.max(prev.zoom, 9),
    }));
  };

  // Handle Copy Share View Link
  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Reset Map View to Nigeria
  const handleResetView = () => {
    setMapViewState(DEFAULT_NIGERIA_VIEW);
    setSelectedIncident(null);
  };

  // Handle Community Submission
  const handleCommunitySubmit = (newSub: Omit<CommunitySubmission, 'id' | 'submittedAt' | 'status'>) => {
    const submissionItem: CommunitySubmission = {
      ...newSub,
      id: `SUB-${Math.floor(1000 + Math.random() * 9000)}`,
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'pending'
    };
    setCommunitySubmissions((prev) => [submissionItem, ...prev]);
  };

  // Curator Queue Approval
  const handleApproveSubmission = (id: string, publishAsCorroborated: boolean) => {
    const found = communitySubmissions.find((s) => s.id === id);
    if (!found) return;

    const newIncident: SecurityIncident = {
      id: `AEG-2026-${Math.floor(100 + Math.random() * 800)}`,
      title: `${found.incidentType.replace('-', ' ').toUpperCase()}: ${found.settlement}, ${found.lga}`,
      incidentType: found.incidentType,
      verificationStatus: publishAsCorroborated ? 'corroborated' : 'community',
      precisionLevel: 'lga-centroid',
      eventDate: found.eventDate,
      publishedDate: new Date().toISOString().split('T')[0],
      state: found.state,
      lga: found.lga,
      settlement: found.settlement,
      latitude: found.latitude,
      longitude: found.longitude,
      summary: found.description,
      fatalities: 0,
      injured: 0,
      abducted: 0,
      propertyDamaged: false,
      magnitude: 'low',
      sources: found.sourceUrls.map((url, i) => ({
        id: `src-${i}`,
        publisher: 'Community Field Contributor',
        title: `Field Incident Report #${found.id}`,
        url: url,
        publishedDate: found.eventDate
      })),
      updates: [
        {
          id: `rev-1`,
          date: new Date().toISOString().split('T')[0],
          summary: `Approved by Aegis Curator Team for public index as ${publishAsCorroborated ? 'Corroborated' : 'Community'} status.`,
          curatorName: 'E. Chukwu (Aegis Documentation Team)'
        }
      ]
    };

    setIncidents((prev) => [newIncident, ...prev]);
    setCommunitySubmissions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleRejectSubmission = (id: string) => {
    setCommunitySubmissions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-[#f7f9fb] font-sans overflow-hidden text-slate-900 select-none">
      {/* Institutional Top Header */}
      <Header
        onOpenSubmission={() => setIsSubmissionOpen(true)}
        onOpenCuratorQueue={() => setIsCuratorQueueOpen(true)}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onResetView={handleResetView}
        onCopyShareLink={handleCopyShareLink}
        pendingSubmissionsCount={communitySubmissions.filter((s) => s.status === 'pending').length}
        copiedLink={copiedLink}
      />

      {/* Factual Statistics Bar */}
      <StatsBanner
        incidents={filteredIncidents}
        datePresetLabel={filterState.dateRangePreset}
      />

      {/* Main Workspace: Map Canvas + Floating Controls + Side Panels */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Detail Panel overlay on the left */}
        {selectedIncident && (
          <DetailPanel
            incident={selectedIncident}
            onClose={() => setSelectedIncident(null)}
            onCopyUpdateLink={(revId) => {
              updateUrlState(mapViewState, selectedIncident.id, feedCollapsed, filterState, revId);
            }}
          />
        )}

        {/* Interactive Map Viewport */}
        <MapContainer
          incidents={filteredIncidents}
          selectedIncident={selectedIncident}
          hoveredIncidentId={hoveredIncidentId}
          onSelectIncident={handleSelectIncident}
          onHoverIncident={setHoveredIncidentId}
          mapViewState={mapViewState}
          onViewStateChange={setMapViewState}
          filterState={filterState}
        />

        {/* Layer & Filter Controls (Top Right) */}
        <FilterPanel
          filterState={filterState}
          onFilterChange={setFilterState}
          onClearFilters={() => setFilterState(DEFAULT_FILTERS)}
        />

        {/* Chronological Feed Rail (Right Side) */}
        <FeedRail
          incidents={filteredIncidents}
          selectedIncident={selectedIncident}
          hoveredIncidentId={hoveredIncidentId}
          onSelectIncident={handleSelectIncident}
          onHoverIncident={setHoveredIncidentId}
          isCollapsed={feedCollapsed}
          onToggleCollapse={() => setFeedCollapsed(!feedCollapsed)}
          dateRangePreset={filterState.dateRangePreset}
        />
      </div>

      {/* Modals */}
      <SubmissionModal
        isOpen={isSubmissionOpen}
        onClose={() => setIsSubmissionOpen(false)}
        onSubmit={handleCommunitySubmit}
      />

      <CuratorQueueModal
        isOpen={isCuratorQueueOpen}
        onClose={() => setIsCuratorQueueOpen(false)}
        submissions={communitySubmissions}
        onApprove={handleApproveSubmission}
        onReject={handleRejectSubmission}
      />

      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        incidents={filteredIncidents}
      />
    </div>
  );
}
