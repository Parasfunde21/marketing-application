import { AppShell } from '../components/layout/AppShell';
import { CampaignForm } from '../components/campaigns/CampaignForm';
import { MediaGenerator } from '../components/media/MediaGenerator';
import { SchedulerPanel } from '../components/scheduler/SchedulerPanel';
import { AnalyticsCards } from '../components/analytics/AnalyticsCards';
import { useRealtimeAnalytics } from '../hooks/useRealtimeAnalytics';

export function App() {
  const engagementData = useRealtimeAnalytics();

  return (
    <AppShell>
      <div className="space-y-4">
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <p className="mt-2 text-sm text-slate-400">AI-native command center for content generation, scheduling, and optimization.</p>
        </section>
        <CampaignForm />
        <MediaGenerator />
        <SchedulerPanel />
        <AnalyticsCards data={engagementData.length ? engagementData : [{ day: 'Mon', engagement: 2.4 }, { day: 'Tue', engagement: 3.1 }, { day: 'Wed', engagement: 4.2 }]} />
      </div>
    </AppShell>
  );
}
