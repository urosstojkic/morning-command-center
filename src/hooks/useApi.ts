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

  const refresh = useCallback(async () => {
    // Status is fast — fire immediately
    setStatus(s => ({ ...s, loading: true, error: null }));
    fetchEndpoint<StatusData>('/api/status')
      .then(d => setStatus({ data: d, loading: false, error: null }))
      .catch(e => setStatus(s => ({ ...s, loading: false, error: (e as Error).message })));

    // Load panels sequentially — WorkIQ processes one query at a time
    const panels: Array<() => Promise<void>> = [
      async () => {
        setCalendar(s => ({ ...s, loading: true, error: null }));
        try {
          const d = await fetchEndpoint<{ meetings: CalendarEvent[]; source: string }>('/api/calendar');
          setCalendar({ data: d.meetings, loading: false, error: null });
        } catch (e) { setCalendar(s => ({ ...s, loading: false, error: (e as Error).message })); }
      },
      async () => {
        setEmails(s => ({ ...s, loading: true, error: null }));
        try {
          const d = await fetchEndpoint<{ emails: Email[]; source: string }>('/api/emails');
          setEmails({ data: d.emails, loading: false, error: null });
        } catch (e) { setEmails(s => ({ ...s, loading: false, error: (e as Error).message })); }
      },
      async () => {
        setTeams(s => ({ ...s, loading: true, error: null }));
        try {
          const d = await fetchEndpoint<{ messages: TeamsMessage[]; source: string }>('/api/teams');
          setTeams({ data: d.messages, loading: false, error: null });
        } catch (e) { setTeams(s => ({ ...s, loading: false, error: (e as Error).message })); }
      },
      async () => {
        setCommitments(s => ({ ...s, loading: true, error: null }));
        try {
          const d = await fetchEndpoint<{ commitments: Commitment[]; source: string }>('/api/commitments');
          setCommitments({ data: d.commitments, loading: false, error: null });
        } catch (e) { setCommitments(s => ({ ...s, loading: false, error: (e as Error).message })); }
      },
      async () => {
        setDocuments(s => ({ ...s, loading: true, error: null }));
        try {
          const d = await fetchEndpoint<{ documents: Document[]; source: string }>('/api/documents');
          setDocuments({ data: d.documents, loading: false, error: null });
        } catch (e) { setDocuments(s => ({ ...s, loading: false, error: (e as Error).message })); }
      },
      async () => {
        setBriefing(s => ({ ...s, loading: true, error: null }));
        try {
          const d = await fetchEndpoint<BriefingData & { source: string }>('/api/briefing');
          setBriefing({ data: d, loading: false, error: null });
        } catch (e) { setBriefing(s => ({ ...s, loading: false, error: (e as Error).message })); }
      },
    ];

    for (const loadPanel of panels) {
      await loadPanel();
    }

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
