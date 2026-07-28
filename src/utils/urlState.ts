import { FilterState, MapViewState } from '../types';

export function parseUrlState(): {
  mapView?: Partial<MapViewState>;
  selectedIncidentId?: string;
  feedCollapsed?: boolean;
  filters?: Partial<FilterState>;
  updateAnchor?: string;
} {
  if (typeof window === 'undefined') return {};

  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const queryParams = new URLSearchParams(window.location.search);

  const getParam = (key: string) => hashParams.get(key) || queryParams.get(key);

  const lat = getParam('lat');
  const lng = getParam('lng');
  const z = getParam('z');
  const inc = getParam('inc');
  const feed = getParam('feed');
  const datePreset = getParam('date');
  const rev = getParam('rev');

  const result: ReturnType<typeof parseUrlState> = {};

  if (lat && lng && z) {
    result.mapView = {
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      zoom: parseInt(z, 10),
    };
  }

  if (inc) {
    result.selectedIncidentId = inc;
  }

  if (feed === 'collapsed') {
    result.feedCollapsed = true;
  }

  if (rev) {
    result.updateAnchor = rev;
  }

  if (datePreset && ['7d', '30d', '90d', '1y', 'all'].includes(datePreset)) {
    result.filters = {
      dateRangePreset: datePreset as any,
    };
  }

  return result;
}

export function updateUrlState(
  mapView: MapViewState,
  selectedIncidentId?: string | null,
  feedCollapsed?: boolean,
  filterState?: FilterState,
  updateAnchor?: string | null
) {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams();
  params.set('lat', mapView.latitude.toFixed(4));
  params.set('lng', mapView.longitude.toFixed(4));
  params.set('z', mapView.zoom.toString());

  if (selectedIncidentId) {
    params.set('inc', selectedIncidentId);
  }

  if (feedCollapsed) {
    params.set('feed', 'collapsed');
  }

  if (filterState?.dateRangePreset) {
    params.set('date', filterState.dateRangePreset);
  }

  if (updateAnchor) {
    params.set('rev', updateAnchor);
  }

  const newHash = `#${params.toString()}`;
  window.history.replaceState(null, '', newHash);
}
