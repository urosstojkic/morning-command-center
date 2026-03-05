import { useState } from 'react';
import { CheckCircle2, Clock, AlertCircle, Mail, MessageSquare, Calendar } from 'lucide-react';
import type { Commitment } from '../../types';

interface Props {
  data: Commitment[] | null;
  loading: boolean;
}

const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string; bg: string; label: string }> = {
  pending: { icon: Clock, color: 'text-[#f59e0b]', bg: 'bg-[#f59e0b]/15', label: 'Pending' },
  'in-progress': { icon: AlertCircle, color: 'text-[#3b82f6]', bg: 'bg-[#3b82f6]/15', label: 'In Progress' },
  done: { icon: CheckCircle2, color: 'text-[#10b981]', bg: 'bg-[#10b981]/15', label: 'Done' },
};

const priorityColors: Record<string, string> = {
  high: 'bg-[#ef4444]/15 text-[#ef4444]',
  medium: 'bg-[#f59e0b]/15 text-[#f59e0b]',
  low: 'bg-[#71717a]/15 text-[#71717a]',
};

function SourceIcon({ source }: { source: string }) {
  const s = source.toLowerCase();
  if (s.includes('email')) return <Mail size={10} className="text-[#3b82f6]" />;
  if (s.includes('teams')) return <MessageSquare size={10} className="text-[#8b5cf6]" />;
  if (s.includes('meeting')) return <Calendar size={10} className="text-[#f59e0b]" />;
  return <Clock size={10} className="text-[#71717a]" />;
}

type Filter = 'all' | 'pending' | 'in-progress' | 'done';

export default function CommitmentsPanel({ data, loading }: Props) {
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = data?.filter(c => filter === 'all' || c.status === filter) ?? [];

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'in-progress', label: 'In Progress' },
    { key: 'done', label: 'Done' },
  ];

  return (
    <div className="panel" style={{ borderColor: '#10b98120' }}>
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-[#10b981]" />
          <h2 className="text-sm font-semibold text-white">Commitments & Actions</h2>
        </div>
        {data && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#10b981]/15 px-1.5 text-xs font-semibold text-[#10b981]">
            {data.filter(c => c.status !== 'done').length} open
          </span>
        )}
      </div>
      <div className="panel-body max-h-[400px] space-y-3 overflow-y-auto">
        {/* Filter pills */}
        <div className="flex gap-1.5">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                filter === f.key
                  ? 'bg-[#10b981]/20 text-[#10b981]'
                  : 'bg-[#27272a] text-[#71717a] hover:text-[#a1a1aa]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-1.5 rounded-xl p-3">
                <div className="skeleton h-3.5 w-4/5" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length ? (
          filtered.map(c => {
            const st = statusConfig[c.status] ?? statusConfig.pending;
            const StatusIcon = st.icon;
            return (
              <div
                key={c.id}
                className="rounded-xl p-3 transition-colors hover:bg-[#27272a]/50"
              >
                <div className="flex items-start gap-2">
                  <StatusIcon size={16} className={`mt-0.5 shrink-0 ${st.color}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white">{c.description}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${priorityColors[c.priority]}`}>
                        {c.priority}
                      </span>
                      <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${st.bg} ${st.color}`}>
                        {st.label}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-[#71717a]">
                        <SourceIcon source={c.source} />
                        {c.source}
                      </span>
                      <span className="text-[10px] text-[#52525b]">Due: {c.dueDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="py-4 text-center text-sm text-[#71717a]">
            {filter === 'all' ? 'No commitments.' : `No ${filter} items.`}
          </p>
        )}
      </div>
    </div>
  );
}
