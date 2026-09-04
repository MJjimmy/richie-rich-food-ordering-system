export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y-2 border-gold/30 bg-gold py-2">
      <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap">
        {row.map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-8 font-display text-sm tracking-[0.18em] text-coal uppercase"
          >
            {t}
            <span className="text-coal/50">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
