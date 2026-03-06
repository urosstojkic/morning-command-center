import { useDashboardData } from './hooks/useApi';
import Header from './components/Header';
import StatusBar from './components/StatusBar';
import BriefingPanel from './components/panels/BriefingPanel';
import CalendarPanel from './components/panels/CalendarPanel';
import EmailPanel from './components/panels/EmailPanel';
import TeamsPanel from './components/panels/TeamsPanel';
import DocumentsPanel from './components/panels/DocumentsPanel';
import CommitmentsPanel from './components/panels/CommitmentsPanel';

function App() {
  const { briefing, calendar, emails, teams, documents, commitments, status, refresh, lastRefresh } =
    useDashboardData();

  const isConnected = status.data?.workiq?.connected ?? false;
  const mode = status.data?.workiq?.mode;

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0f]">
      <Header isConnected={isConnected} mode={mode} lastRefresh={lastRefresh} onRefresh={refresh} />

      <main className="mx-auto w-full max-w-[1600px] flex-1 px-6 py-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {/* Row 1: Briefing (wide) + Calendar */}
          <div className="animate-fade-in md:col-span-2">
            <BriefingPanel data={briefing.data} loading={briefing.loading} />
          </div>
          <div className="animate-fade-in delay-100">
            <CalendarPanel data={calendar.data} loading={calendar.loading} />
          </div>

          {/* Row 2: Emails + Teams */}
          <div className="animate-fade-in delay-150">
            <EmailPanel data={emails.data} loading={emails.loading} />
          </div>
          <div className="animate-fade-in delay-200">
            <TeamsPanel data={teams.data} loading={teams.loading} />
          </div>

          {/* Row 3: Commitments + Documents */}
          <div className="animate-fade-in md:col-span-2 xl:col-span-2 delay-250">
            <CommitmentsPanel data={commitments.data} loading={commitments.loading} />
          </div>
          <div className="animate-fade-in delay-300">
            <DocumentsPanel data={documents.data} loading={documents.loading} />
          </div>
        </div>
      </main>

      <StatusBar isConnected={isConnected} />
    </div>
  );
}

export default App;
