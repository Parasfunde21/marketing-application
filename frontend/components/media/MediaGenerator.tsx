import { useState } from 'react';
import { generateImage, generateVideo } from '@lib/api';

export function MediaGenerator() {
  const [prompt, setPrompt] = useState('');
  const [asset, setAsset] = useState<string | null>(null);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <h2 className="text-lg font-semibold">AI Media Generator</h2>
      <textarea
        className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-950 p-3"
        rows={4}
        value={prompt}
        placeholder="Describe the visual you want"
        onChange={(e) => setPrompt(e.target.value)}
      />
      <div className="mt-3 flex gap-2">
        <button className="rounded-lg bg-brand px-3 py-2" onClick={async () => setAsset((await generateImage({ prompt })).url)}>
          Generate Image
        </button>
        <button className="rounded-lg bg-slate-700 px-3 py-2" onClick={async () => setAsset((await generateVideo({ prompt })).url)}>
          Generate Video
        </button>
      </div>
      {asset && <p className="mt-3 text-sm text-emerald-300">Stored asset: {asset}</p>}
    </section>
  );
}
