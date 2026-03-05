import { useState, useEffect } from 'react';
import { Activity, RefreshCw, Zap } from 'lucide-react';

interface HeaderProps {
  isConnected: boolean;
  mode: string | undefined;
  lastRefresh: Date | null;
  onRefresh: () => void;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

export default function Header({ isConnected, mode, lastRefresh, onRefresh }: HeaderProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="glass sticky top-0 z-50 border-b border-[#27272a] bg-[#0a0a0f]/80">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-3">
        {/* Left — Logo + title */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#ec4899]">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-semibold leading-tight text-white">Morning Command Center</h1>
            <p className="text-xs text-[#a1a1aa]">{getGreeting()}, Uros!</p>
          </div>
        </div>

        {/* Center — Date + time */}
        <div className="hidden text-center md:block">
          <p className="text-sm font-medium text-white">{formatTime(now)}</p>
          <p className="text-xs text-[#71717a]">{formatDate(now)}</p>
        </div>

        {/* Right — Status + refresh */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full border border-[#27272a] bg-[#1a1a24] px-3 py-1.5">
            <Activity size={12} className={isConnected ? 'text-[#10b981]' : 'text-[#71717a]'} />
            <span className="text-xs text-[#a1a1aa]">{mode === 'live' ? 'Live' : 'Demo'}</span>
          </div>
          {lastRefresh && (
            <span className="hidden text-xs text-[#71717a] lg:inline">
              Updated {formatTime(lastRefresh)}
            </span>
          )}
          <button
            onClick={onRefresh}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#27272a] bg-[#1a1a24] text-[#a1a1aa] transition-all hover:border-[#3f3f46] hover:text-white"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
    </header>
  );
}
