type P = { className?: string };

const base = "shrink-0";

export const IconCart = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`}>
    <path d="M3 4h2.2l2.1 11.2a1.6 1.6 0 0 0 1.6 1.3h8.5a1.6 1.6 0 0 0 1.6-1.2L21 8H6" />
    <circle cx="9.5" cy="20" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="17.5" cy="20" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);

export const IconPlus = ({ className = "w-4 h-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" className={`${base} ${className}`}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconMinus = ({ className = "w-4 h-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" className={`${base} ${className}`}>
    <path d="M5 12h14" />
  </svg>
);

export const IconTrash = ({ className = "w-4 h-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`}>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
  </svg>
);

export const IconFlame = ({ className = "w-4 h-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`${base} ${className}`}>
    <path d="M12 2s1 3.2-1.5 6C8 10.8 6 12.6 6 15.4A6 6 0 0 0 12 21.5a6 6 0 0 0 6-6.1c0-2.3-1-4-2.3-5.6-.4 1-1 1.8-1.9 2.3.3-3.6-.6-7.6-1.8-10.1Z" />
    <path d="M12 21.5a3 3 0 0 1-3-3c0-1.5 1-2.5 3-4.4 2 1.9 3 2.9 3 4.4a3 3 0 0 1-3 3Z" fill="#0b1210" opacity=".55" />
  </svg>
);

export const IconBike = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`}>
    <circle cx="5.5" cy="17" r="3.2" />
    <circle cx="18.5" cy="17" r="3.2" />
    <path d="M5.5 17 9 9h4l3 8M9 9 8 6H5.5M13 9h3.5M12 17h3.5" />
  </svg>
);

export const IconBag = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`}>
    <path d="M5 8h14l-1.2 12H6.2L5 8Z" />
    <path d="M9 10V6a3 3 0 0 1 6 0v4" />
  </svg>
);

export const IconWhatsApp = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`${base} ${className}`}>
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.7.8-.8 1-.1.2-.3.2-.6.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.6-1.2.1-.2 0-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.4-.9 1-1 2.3-.2 3.7a10.4 10.4 0 0 0 4.6 4.2c1.7.7 2.4.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2Z" />
  </svg>
);

export const IconCard = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={`${base} ${className}`}>
    <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
    <path d="M2.5 10h19M6 15h4" />
  </svg>
);

export const IconBank = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`}>
    <path d="M3 9.5 12 4l9 5.5M4.5 10v8M9.5 10v8M14.5 10v8M19.5 10v8M3 20h18" />
  </svg>
);

export const IconCash = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={`${base} ${className}`}>
    <rect x="2.5" y="6.5" width="19" height="11" rx="2" />
    <circle cx="12" cy="12" r="2.6" />
    <path d="M6 10v4M18 10v4" />
  </svg>
);

export const IconBolt = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`${base} ${className}`}>
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
  </svg>
);

export const IconClock = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={`${base} ${className}`}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </svg>
);

export const IconChef = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`}>
    <path d="M7 13a4 4 0 0 1-1.5-7.7A4.5 4.5 0 0 1 12 4a4.5 4.5 0 0 1 6.5 1.3A4 4 0 0 1 17 13v4H7v-4Z" />
    <path d="M7 20h10M10 13v4M14 13v4" />
  </svg>
);

export const IconCrown = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`${base} ${className}`}>
    <path d="M3 8.5 7 12l5-6.5L17 12l4-3.5L19.5 18h-15L3 8.5Z" />
    <rect x="5" y="19.2" width="14" height="2" rx="1" />
  </svg>
);

export const IconSearch = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={`${base} ${className}`}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </svg>
);

export const IconCheck = ({ className = "w-4 h-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`}>
    <path d="m4.5 12.5 5 5 10-11" />
  </svg>
);

export const IconX = ({ className = "w-4 h-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" className={`${base} ${className}`}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const IconPin = ({ className = "w-4 h-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`}>
    <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);

export const IconPhone = ({ className = "w-4 h-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`}>
    <path d="M5 3h4l1.5 5L8 9.5a12 12 0 0 0 6.5 6.5l1.5-2.5 5 1.5v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2Z" />
  </svg>
);

export const IconStar = ({ className = "w-4 h-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`${base} ${className}`}>
    <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9 2.9-6Z" />
  </svg>
);

export const IconArrow = ({ className = "w-4 h-4" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`}>
    <path d="M4 12h15m-6-7 7 7-7 7" />
  </svg>
);

export const IconReceipt = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`}>
    <path d="M6 2.5h12v19l-2.4-1.6-2.4 1.6-2.4-1.6L8.4 21.5 6 19.9v-17Z" />
    <path d="M9 7.5h6M9 11h6M9 14.5h4" />
  </svg>
);

export const IconTicket = ({ className = "w-5 h-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`${base} ${className}`}>
    <path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v-3a2 2 0 0 0 0-4V8Z" transform="translate(0 -1)" />
    <path d="M14 6v2M14 11v2M14 16v2" />
  </svg>
);
