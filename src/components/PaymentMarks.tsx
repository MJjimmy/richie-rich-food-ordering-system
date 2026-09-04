type P = { className?: string };

export const MarkYoco = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" fill="currentColor" opacity=".16" />
    <path d="M7 6v6a5 5 0 0 0 10 0V6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M12 17v3" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

export const MarkOzow = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2 21 7v10l-9 5-9-5V7l9-5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M13 7 9 13h3l-1 4 4-6h-3l1-4Z" fill="currentColor" />
  </svg>
);

export const MarkPayFast = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 15.5 12 8l4 7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.6 13h4.8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

export const MarkCash = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="2" y="6" width="20" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.8" />
    <path d="M5.5 9.5v5M18.5 9.5v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export function ProviderMark({ provider, className }: { provider: string; className?: string }) {
  if (provider === "yoco") return <MarkYoco className={className} />;
  if (provider === "ozow") return <MarkOzow className={className} />;
  if (provider === "payfast") return <MarkPayFast className={className} />;
  return <MarkCash className={className} />;
}

export const PROVIDERS = [
  {
    id: "yoco",
    name: "Yoco",
    detail: "Card payments · Visa & Mastercard",
    Mark: MarkYoco,
  },
  {
    id: "ozow",
    name: "Ozow",
    detail: "Instant EFT straight from your bank",
    Mark: MarkOzow,
  },
  {
    id: "payfast",
    name: "PayFast",
    detail: "Card, EFT & more in one rail",
    Mark: MarkPayFast,
  },
  {
    id: "cash",
    name: "Cash",
    detail: "Pay at the counter or on delivery",
    Mark: MarkCash,
  },
] as const;
