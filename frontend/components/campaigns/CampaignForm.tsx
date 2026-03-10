import { useState } from 'react';
import { generatePost } from '@lib/api';

const initial = {
  productName: '',
  goal: '',
  targetAudience: '',
  platform: 'instagram',
  model: 'claude-3-7-sonnet'
};

export function CampaignForm() {
  const [form, setForm] = useState(initial);
  const [result, setResult] = useState<any>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await generatePost(form);
    setResult(data);
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <h2 className="text-lg font-semibold">AI Content Generator</h2>
      <form className="mt-4 grid gap-3" onSubmit={onSubmit}>
        {Object.entries(form).map(([key, value]) => (
          <input
            key={key}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
            value={value}
            onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
            placeholder={key}
          />
        ))}
        <button className="rounded-lg bg-brand px-4 py-2 font-medium">Generate</button>
      </form>
      {result && (
        <pre className="mt-4 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-300">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </section>
  );
}
