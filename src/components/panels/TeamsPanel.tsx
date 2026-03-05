import { MessageSquare, AtSign } from 'lucide-react';
import type { TeamsMessage } from '../../types';

interface Props {
  data: TeamsMessage[] | null;
  loading: boolean;
}

export default function TeamsPanel({ data, loading }: Props) {
  return (
    <div className="panel" style={{ borderColor: '#8b5cf620' }}>
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-[#8b5cf6]" />
          <h2 className="text-sm font-semibold text-white">Teams Messages</h2>
        </div>
        {data && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#8b5cf6]/15 px-1.5 text-xs font-semibold text-[#8b5cf6]">
            {data.filter(m => m.mentions).length} mentions
          </span>
        )}
      </div>
      <div className="panel-body max-h-[400px] space-y-1 overflow-y-auto">
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-1.5 rounded-xl p-3">
                <div className="skeleton h-3 w-1/3" />
                <div className="skeleton h-3.5 w-2/3" />
                <div className="skeleton h-3 w-full" />
              </div>
            ))}
          </div>
        ) : data?.length ? (
          data.map(m => (
            <div
              key={m.id}
              className={`rounded-xl p-3 transition-colors hover:bg-[#27272a]/50 ${
                m.mentions ? 'border-l-2 border-l-[#8b5cf6]' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-[#27272a] px-2 py-0.5 text-[10px] font-medium text-[#a1a1aa]">
                  {m.channel}
                </span>
                <span className="text-[10px] text-[#52525b]">{m.timestamp}</span>
              </div>
              <div className="mt-1.5 flex items-center gap-1.5">
                <p className="text-sm font-medium text-white">{m.from}</p>
                {m.mentions && <AtSign size={12} className="text-[#8b5cf6]" />}
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-[#71717a]">{m.preview}</p>
            </div>
          ))
        ) : (
          <p className="py-4 text-center text-sm text-[#71717a]">No messages.</p>
        )}
      </div>
    </div>
  );
}
