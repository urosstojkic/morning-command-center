export interface BriefingData {
  summary: string;
  highlights: string[];
  generatedAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  duration: string;
  attendees: string[];
  location: string;
  isHighPriority: boolean;
}

export interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  receivedAt: string;
  isUrgent: boolean;
  hasAttachment: boolean;
}

export interface TeamsMessage {
  id: string;
  from: string;
  channel: string;
  preview: string;
  timestamp: string;
  mentions: boolean;
}

export interface Document {
  id: string;
  title: string;
  sharedBy: string;
  sharedAt: string;
  type: string;
  url: string;
}

export interface Commitment {
  id: string;
  description: string;
  source: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'done';
}

export interface StatusData {
  status: string;
  uptime: number;
  workiq: {
    connected: boolean;
    mode: 'live' | 'demo';
  };
  timestamp: string;
}

export interface DashboardData {
  briefing: { data: BriefingData | null; loading: boolean; error: string | null };
  calendar: { data: CalendarEvent[] | null; loading: boolean; error: string | null };
  emails: { data: Email[] | null; loading: boolean; error: string | null };
  teams: { data: TeamsMessage[] | null; loading: boolean; error: string | null };
  documents: { data: Document[] | null; loading: boolean; error: string | null };
  commitments: { data: Commitment[] | null; loading: boolean; error: string | null };
  status: { data: StatusData | null; loading: boolean; error: string | null };
  refresh: () => void;
  lastRefresh: Date | null;
}
