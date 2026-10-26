export function Ticker({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  const display = items.slice(0, 6);
  return (
    <div className="border-b border-emerald-900/40 bg-slate-950/60">
      <div className="mx-auto flex max-w-6xl items-center gap-3 overflow-hidden px-4 py-2">
        <span className="shrink-0 rounded-md bg-rose-500/20 px-2 py-0.5 text-xs font-bold uppercase tracking-widest text-rose-300">
          Live
        </span>
        <div className="flex-1 overflow-hidden">
          <div className="flex gap-8 whitespace-nowrap text-xs text-emerald-200/80">
            {display.map((item, i) => (
              <span key={i} className="inline-block">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}