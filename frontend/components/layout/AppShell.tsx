import { ReactNode, useState } from 'react';

const navItems = ['Dashboard', 'Campaigns', 'Post Generator', 'Media', 'Scheduler', 'Analytics', 'Settings'];

export function AppShell({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto grid max-w-7xl grid-cols-12 gap-6 px-4 py-6 lg:px-8">
          <aside className="col-span-12 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 lg:col-span-3">
            <h1 className="text-xl font-semibold">SolisBoard 2.0</h1>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              {navItems.map((item) => (
                <li key={item} className="rounded-lg px-3 py-2 hover:bg-slate-800/40 hover:text-white">
                  {item}
                </li>
              ))}
            </ul>
            <button
              className="mt-6 rounded-lg border border-slate-600 px-3 py-2 text-sm"
              onClick={() => setDarkMode((prev) => !prev)}
            >
              Toggle {darkMode ? 'Light' : 'Dark'}
            </button>
          </aside>
          <main className="col-span-12 lg:col-span-9">{children}</main>
        </div>
      </div>
    </div>
  );
}
