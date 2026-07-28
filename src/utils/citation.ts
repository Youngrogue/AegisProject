import { SecurityIncident } from '../types';

export function generateChicagoCitation(incident: SecurityIncident, accessDate: string = 'July 23, 2026'): string {
  return `Aegis Institutional Security Platform. "${incident.title} (${incident.id})." Incident Record, ${incident.state} State, Nigeria. Event date: ${incident.eventDate}. Accessed ${accessDate}. ${window.location.origin}/?inc=${incident.id}`;
}

export function generateAPACitation(incident: SecurityIncident, accessDate: string = 'July 23, 2026'): string {
  const year = new Date(incident.eventDate).getFullYear();
  return `Aegis Institutional. (${year}). Security Incident Record ${incident.id}: ${incident.title}. ${incident.lga} LGA, ${incident.state} State. Retrieved ${accessDate}, from ${window.location.origin}/?inc=${incident.id}`;
}

export function generateBibTeX(incident: SecurityIncident): string {
  const year = new Date(incident.eventDate).getFullYear();
  return `@misc{aegis_${incident.id.toLowerCase().replace(/-/g, '_')},
  author = {{Aegis Institutional Platform}},
  title = {{Security Incident Record ${incident.id}: ${incident.title}}},
  year = {${year}},
  howpublished = {\\url{${window.location.origin}/?inc=${incident.id}}},
  note = {Verification Status: ${incident.verificationStatus.toUpperCase()}; State: ${incident.state}}
}`;
}
