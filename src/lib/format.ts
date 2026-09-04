export function rand(cents: number): string {
  return `R${(cents / 100).toFixed(2)}`;
}

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const mins = Math.max(0, Math.floor((Date.now() - then) / 60000));
  if (mins < 1) return "just now";
  if (mins === 1) return "1 min ago";
  if (mins < 60) return `${mins} mins ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m ago`;
}

export function clockTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const PROVIDER_LABEL: Record<string, string> = {
  yoco: "Yoco · Card",
  ozow: "Ozow · Instant EFT",
  payfast: "PayFast",
  cash: "Cash",
};

export const STATUS_LABEL: Record<string, string> = {
  new: "Fired in the kitchen",
  preparing: "On the flames",
  ready: "Ready for hand-over",
  out_for_delivery: "Out for delivery",
  completed: "Handed over",
  cancelled: "Cancelled",
};
