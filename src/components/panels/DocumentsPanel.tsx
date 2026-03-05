import { FileText, ExternalLink, FileSpreadsheet, FileIcon, Presentation } from 'lucide-react';
import type { Document } from '../../types';

interface Props {
  data: Document[] | null;
  loading: boolean;
}

function FileTypeIcon({ type }: { type: string }) {
  const t = type.toLowerCase();
  if (t.includes('excel') || t.includes('xlsx')) return <FileSpreadsheet size={16} className="text-[#10b981]" />;
  if (t.includes('word') || t.includes('docx')) return <FileText size={16} className="text-[#3b82f6]" />;
  if (t.includes('powerpoint') || t.includes('pptx')) return <Presentation size={16} className="text-[#f59e0b]" />;
  if (t.includes('pdf')) return <FileIcon size={16} className="text-[#ef4444]" />;
  return <FileIcon size={16} className="text-[#71717a]" />;
}

function typeBadgeColor(type: string): string {
  const t = type.toLowerCase();
  if (t.includes('excel')) return 'bg-[#10b981]/15 text-[#10b981]';
  if (t.includes('word')) return 'bg-[#3b82f6]/15 text-[#3b82f6]';
  if (t.includes('powerpoint')) return 'bg-[#f59e0b]/15 text-[#f59e0b]';
  if (t.includes('pdf')) return 'bg-[#ef4444]/15 text-[#ef4444]';
  return 'bg-[#71717a]/15 text-[#71717a]';
}

export default function DocumentsPanel({ data, loading }: Props) {
  return (
    <div className="panel" style={{ borderColor: '#06b6d420' }}>
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-[#06b6d4]" />
          <h2 className="text-sm font-semibold text-white">Recent Documents</h2>
        </div>
        {data && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#06b6d4]/15 px-1.5 text-xs font-semibold text-[#06b6d4]">
            {data.length}
          </span>
        )}
      </div>
      <div className="panel-body max-h-[400px] space-y-1 overflow-y-auto">
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl p-3">
                <div className="skeleton h-8 w-8 !rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <div className="skeleton h-3.5 w-3/4" />
                  <div className="skeleton h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : data?.length ? (
          data.map(d => (
            <div
              key={d.id}
              className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-[#27272a]/50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#27272a]">
                <FileTypeIcon type={d.type} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{d.title}</p>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-[#71717a]">
                  <span>{d.sharedBy}</span>
                  <span>·</span>
                  <span>{d.sharedAt}</span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${typeBadgeColor(d.type)}`}>
                  {d.type}
                </span>
                <a
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#27272a] text-[#71717a] transition-colors hover:border-[#3f3f46] hover:text-white"
                >
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))
        ) : (
          <p className="py-4 text-center text-sm text-[#71717a]">No documents.</p>
        )}
      </div>
    </div>
  );
}
