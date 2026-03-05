import { Sparkles, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { BriefingData } from '../../types';

interface Props {
  data: BriefingData | null;
  loading: boolean;
}

function TrendIcon({ label }: { label: string }) {
  const lower = label.toLowerCase();
  if (lower.includes('up') || lower.includes('increase') || lower.includes('above'))
    return <TrendingUp size={14} className="text-[#10b981]" />;
  if (lower.includes('down') || lower.includes('decrease') || lower.includes('slip'))
    return <TrendingDown size={14} className="text-[#ef4444]" />;
  return <Minus size={14} className="text-[#71717a]" />;
}

export default function BriefingPanel({ data, loading }: Props) {
  return (
    <div className="panel" style={{ borderColor: '#8b5cf620' }}>
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#8b5cf6]" />
          <h2 className="text-sm font-semibold text-white">AI Morning Briefing</h2>
        </div>
        {data?.generatedAt && (
          <span className="text-xs text-[#71717a]">
            {new Date(data.generatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
      <div className="panel-body space-y-4">
        {loading ? (
          <div className="space-y-3">
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-5/6" />
            <div className="skeleton h-4 w-4/6" />
            <div className="mt-4 space-y-2">
              {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-3 w-full" />)}
            </div>
          </div>
        ) : data ? (
          <>
            <p className="text-sm leading-relaxed text-[#a1a1aa]">{data.summary}</p>
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#71717a]">Key Priorities</h3>
              <ol className="space-y-2">
                {data.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#a1a1aa]">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#8b5cf6]/10 text-xs font-semibold text-[#8b5cf6]">
                      {i + 1}
                    </span>
                    <span className="flex items-center gap-1.5">
                      {h}
                      <TrendIcon label={h} />
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </>
        ) : (
          <p className="text-sm text-[#71717a]">No briefing data available.</p>
        )}
      </div>
    </div>
  );
}
