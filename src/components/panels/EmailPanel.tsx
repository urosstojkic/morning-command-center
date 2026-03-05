import { Mail, AlertTriangle, Paperclip } from 'lucide-react';
import type { Email } from '../../types';

interface Props {
  data: Email[] | null;
  loading: boolean;
}

export default function EmailPanel({ data, loading }: Props) {
  return (
    <div className="panel" style={{ borderColor: '#3b82f620' }}>
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <Mail size={16} className="text-[#3b82f6]" />
          <h2 className="text-sm font-semibold text-white">Priority Inbox</h2>
        </div>
        {data && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#3b82f6]/15 px-1.5 text-xs font-semibold text-[#3b82f6]">
            {data.filter(e => e.isUrgent).length} urgent
          </span>
        )}
      </div>
      <div className="panel-body max-h-[400px] space-y-1 overflow-y-auto">
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-1.5 rounded-xl p-3">
                <div className="skeleton h-3.5 w-2/3" />
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-3 w-4/5" />
              </div>
            ))}
          </div>
        ) : data?.length ? (
          data.map(e => (
            <div
              key={e.id}
              className="rounded-xl p-3 transition-colors hover:bg-[#27272a]/50"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-[#3b82f6]" />
                    <p className="truncate text-sm font-medium text-white">{e.from}</p>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-[#a1a1aa]">{e.subject}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {e.hasAttachment && <Paperclip size={12} className="text-[#71717a]" />}
                  {e.isUrgent && (
                    <span className="flex items-center gap-1 rounded-md bg-[#ef4444]/15 px-1.5 py-0.5 text-[10px] font-semibold text-[#ef4444]">
                      <AlertTriangle size={10} />
                      Urgent
                    </span>
                  )}
                </div>
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-[#71717a]">{e.preview}</p>
              <p className="mt-1.5 text-[10px] text-[#52525b]">{e.receivedAt}</p>
            </div>
          ))
        ) : (
          <p className="py-4 text-center text-sm text-[#71717a]">No emails.</p>
        )}
      </div>
    </div>
  );
}
