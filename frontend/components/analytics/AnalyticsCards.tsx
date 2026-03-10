import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function AnalyticsCards({ data }: { data: Array<{ day: string; engagement: number }> }) {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <h3 className="text-sm font-medium text-slate-400">Engagement Over Time</h3>
        <div className="mt-4 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="day" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip />
              <Line type="monotone" dataKey="engagement" stroke="#A78BFA" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>
      <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <h3 className="text-sm font-medium text-slate-400">Best Posting Time</h3>
        <p className="mt-4 text-3xl font-semibold">14:30 UTC</p>
        <p className="mt-2 text-sm text-slate-400">Derived from top 30% performing posts in the last 30 days.</p>
      </article>
    </section>
  );
}
