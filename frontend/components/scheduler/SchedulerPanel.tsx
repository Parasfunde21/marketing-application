import { useState } from 'react';
import { schedulePost } from '@lib/api';

export function SchedulerPanel() {
  const [postId, setPostId] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <h2 className="text-lg font-semibold">Campaign Scheduler</h2>
      <div className="mt-3 grid gap-3">
        <input className="rounded-lg border border-slate-700 bg-slate-950 p-2" value={postId} onChange={(e) => setPostId(e.target.value)} placeholder="Post ID" />
        <input className="rounded-lg border border-slate-700 bg-slate-950 p-2" type="datetime-local" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} />
        <button
          className="rounded-lg bg-brand px-3 py-2"
          onClick={() => schedulePost({ postId, scheduledTime: new Date(scheduledTime).toISOString() })}
        >
          Schedule
        </button>
      </div>
    </section>
  );
}
