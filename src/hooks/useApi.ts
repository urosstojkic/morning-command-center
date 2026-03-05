import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  BriefingData,
  CalendarEvent,
  Email,
  TeamsMessage,
  Document,
  Commitment,
  StatusData,
  DashboardData,
} from '../types';

interface EndpointState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

async function fetchEndpoint<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export function useDashboardData(): DashboardData {
  const [briefing, setBriefing] = useState<EndpointState<BriefingData>>({ data: null, loading: true, error: null });
  const [calendar, setCalendar] = useState<EndpointState<CalendarEvent[]>>({ data: null, loading: true, error: null });
  const [emails, setEmails] = useState<EndpointState<Email[]>>({ data: null, loading: true, error: null });
  const [teams, setTeams] = useState<EndpointState<TeamsMessage[]>>({ data: null, loading: true, error: null });
  const [documents, setDocuments] = useState<EndpointState<Document[]>>({ data: null, loading: true, error: null });
  const [commitments, setCommitments] = useState<EndpointState<Commitment[]>>({ data: null, loading: true, error: null });
  const [status, setStatus] = useState<EndpointState<StatusData>>({ data: null, loading: true, error: null });
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(() => {
    setBriefing(s => ({ ...s, loading: true, error: null }));
    setCalendar(s => ({ ...s, loading: true, error: null }));
    setEmails(s => ({ ...s, loading: true, error: null }));
    setTeams(s => ({ ...s, loading: true, error: null }));
    setDocuments(s => ({ ...s, loading: true, error: null }));
    setCommitments(s => ({ ...s, loading: true, error: null }));
    setStatus(s => ({ ...s, loading: true, error: null }));

    fetchEndpoint<BriefingData & { source: string }>('/api/briefing')
      .then(d => setBriefing({ data: d, loading: false, error: null }))
      .catch(e => setBriefing(s => ({ ...s, loading: false, error: (e as Error).message })));

    fetchEndpoint<{ meetings: CalendarEvent[]; source: string }>('/api/calendar')
      .then(d => setCalendar({ data: d.meetings, loading: false, error: null }))
      .catch(e => setCalendar(s => ({ ...s, loading: false, error: (e as Error).message })));

    fetchEndpoint<{ emails: Email[]; source: string }>('/api/emails')
      .then(d => setEmails({ data: d.emails, loading: false, error: null }))
      .catch(e => setEmails(s => ({ ...s, loading: false, error: (e as Error).message })));

    fetchEndpoint<{ messages: TeamsMessage[]; source: string }>('/api/teams')
      .then(d => setTeams({ data: d.messages, loading: false, error: null }))
      .catch(e => setTeams(s => ({ ...s, loading: false, error: (e as Error).message })));

    fetchEndpoint<{ documents: Document[]; source: string }>('/api/documents')
      .then(d => setDocuments({ data: d.documents, loading: false, error: null }))
      .catch(e => setDocuments(s => ({ ...s, loading: false, error: (e as Error).message })));

    fetchEndpoint<{ commitments: Commitment[]; source: string }>('/api/commitments')
      .then(d => setCommitments({ data: d.commitments, loading: false, error: null }))
      .catch(e => setCommitments(s => ({ ...s, loading: false, error: (e as Error).message })));

    fetchEndpoint<StatusData>('/api/status')
      .then(d => setStatus({ data: d, loading: false, error: null }))
      .catch(e => setStatus(s => ({ ...s, loading: false, error: (e as Error).message })));

    setLastRefresh(new Date());
  }, []);

  useEffect(() => {
    refresh();
    intervalRef.current = setInterval(refresh, REFRESH_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [refresh]);

  return { briefing, calendar, emails, teams, documents, commitments, status, refresh, lastRefresh };
}
