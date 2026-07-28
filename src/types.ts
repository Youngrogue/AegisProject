export type VerificationStatus = 'corroborated' | 'single-source' | 'disputed' | 'community' | 'retracted';

export type IncidentType = 
  | 'armed-banditry'
  | 'insurgency-iswap'
  | 'farmer-herder'
  | 'kidnapping'
  | 'civil-unrest'
  | 'maritime-piracy'
  | 'military-op';

export type PrecisionLevel = 'exact' | 'settlement-centroid' | 'lga-centroid';

export interface Source {
  id: string;
  publisher: string;
  title: string;
  url: string;
  publishedDate: string;
  isPrimary?: boolean;
  archiveUrl?: string;
}

export interface IncidentUpdate {
  id: string;
  date: string;
  summary: string;
  curatorName: string;
  statusChange?: VerificationStatus;
  sourcesAdded?: Source[];
}

export interface SecurityIncident {
  id: string; // e.g. AEG-2026-084
  title: string;
  incidentType: IncidentType;
  verificationStatus: VerificationStatus;
  precisionLevel: PrecisionLevel;
  eventDate: string; // ISO format
  publishedDate: string;
  state: string;
  lga: string;
  settlement: string;
  latitude: number;
  longitude: number;
  summary: string;
  fatalities: number;
  injured: number;
  abducted: number;
  propertyDamaged: boolean;
  sources: Source[];
  updates: IncidentUpdate[];
  disputeReason?: string;
  retractionReason?: string;
  retractedDate?: string;
  magnitude: 'low' | 'medium' | 'high'; // low: <5 impact, medium: 5-20, high: >20
}

export interface FilterState {
  incidentTypes: IncidentType[];
  verificationStatuses: VerificationStatus[];
  dateRangePreset: '7d' | '30d' | '90d' | '1y' | 'all' | 'custom';
  customStartDate?: string;
  customEndDate?: string;
  searchQuery: string;
  precisionLevels: PrecisionLevel[];
  selectedState?: string;
  showBoundaryState: boolean;
  showBoundaryLGA: boolean;
  viewMode: 'markers' | 'choropleth';
  mapStyle: 'light' | 'terrain' | 'grayscale';
}

export interface MapViewState {
  latitude: number;
  longitude: number;
  zoom: number;
}

export interface CommunitySubmission {
  id: string;
  submittedAt: string;
  eventDate: string;
  state: string;
  lga: string;
  settlement: string;
  latitude: number;
  longitude: number;
  incidentType: IncidentType;
  description: string;
  sourceUrls: string[];
  contributorNotes?: string;
  status: 'pending' | 'approved' | 'rejected';
}
