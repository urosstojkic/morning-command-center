import { ExternalLink } from 'lucide-react';

const links = [
  { label: 'Outlook', url: 'https://outlook.office.com' },
  { label: 'Teams', url: 'https://teams.microsoft.com' },
  { label: 'SharePoint', url: 'https://sharepoint.com' },
  { label: 'OneDrive', url: 'https://onedrive.com' },
];

interface StatusBarProps {
  isConnected: boolean;
}

export default function StatusBar({ isConnected }: StatusBarProps) {
  return (
    <footer className="border-t border-[#27272a] bg-[#0a0a0f] px-6 py-3">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between">
        <div className="flex items-center gap-4">
          {links.map(l => (
            <a
              key={l.label}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-[#71717a] transition-colors hover:text-[#a1a1aa]"
            >
              {l.label}
              <ExternalLink size={10} />
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#71717a]">Powered by WorkIQ MCP</span>
          <span className={`inline-block h-2 w-2 rounded-full ${isConnected ? 'bg-[#10b981]' : 'bg-[#71717a]'}`} />
        </div>
      </div>
    </footer>
  );
}
