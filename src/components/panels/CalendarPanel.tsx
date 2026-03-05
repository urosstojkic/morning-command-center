import { Calendar, MapPin, Users, Video } from 'lucide-react';
import type { CalendarEvent } from '../../types';

interface Props {
  data: CalendarEvent[] | null;
  loading: boolean;
}

export default function CalendarPanel({ data, loading }: Props) {
  return (
    <div className="panel" style={{ borderColor: '#f59e0b20' }}>
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-[#f59e0b]" />
          <h2 className="text-sm font-semibold text-white">Today's Meetings</h2>
        </div>
        {data && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f59e0b]/15 px-1.5 text-xs font-semibold text-[#f59e0b]">
            {data.length}
          </span>
        )}
      </div>
      <div className="panel-body max-h-[400px] space-y-1 overflow-y-auto">
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="skeleton h-10 w-16" />
                <div className="flex-1 space-y-1.5">
                  <div className="skeleton h-3.5 w-3/4" />
                  <div className="skeleton h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : data?.length ? (
          data.map(m => (
            <div
              key={m.id}
              className={`flex gap-3 rounded-xl p-3 transition-colors hover:bg-[#27272a]/50 ${
                m.isHighPriority ? 'border-l-2 border-l-[#f59e0b]' : ''
              }`}
            >
              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold text-white">{m.time}</p>
                <p className="text-xs text-[#71717a]">{m.duration}</p>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-white">{m.title}</p>
                  {m.isHighPriority && (
                    <span className="shrink-0 rounded-md bg-[#f59e0b]/15 px-1.5 py-0.5 text-[10px] font-semibold text-[#f59e0b]">
                      Priority
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-[#71717a]">
                  <span className="flex items-center gap-1">
                    <Users size={10} />
                    {m.attendees.length} attendees
                  </span>
                  <span className="flex items-center gap-1">
                    {m.location.toLowerCase().includes('teams') ? <Video size={10} /> : <MapPin size={10} />}
                    <span className="truncate">{m.location}</span>
                  </span>
                </div>
                {m.location.toLowerCase().includes('teams') && (
                  <button className="mt-1.5 rounded-lg bg-[#8b5cf6]/15 px-2.5 py-1 text-xs font-medium text-[#8b5cf6] transition-colors hover:bg-[#8b5cf6]/25">
                    Join
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="py-4 text-center text-sm text-[#71717a]">No meetings today.</p>
        )}
      </div>
    </div>
  );
}
