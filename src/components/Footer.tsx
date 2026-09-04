import Link from "next/link";
import { RESTAURANT, waLink } from "@/lib/constants";
import { IconCheck, IconClock, IconPhone, IconPin, IconWhatsApp } from "./icons";

const packagePoints = [
  "Custom digital menu & mobile web ordering portal",
  "Payment gateway setup — Card / Instant EFT / Cash",
  "Automated WhatsApp confirmation + receipt on payment",
];

export function Footer() {
  return (
    <footer className="mt-20 border-t-2 border-gold/25 bg-coal2">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl text-cream uppercase">
            Richie <span className="text-gold">Rich</span>
          </p>
          <p className="mt-1 text-xs font-semibold tracking-[0.28em] text-dim uppercase">
            {RESTAURANT.tagline}
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-dim">
            Township flavour, plated properly. Kotas, worsrolls, shawarmas and
            share boxes fired to order in Pretoria CBD.
          </p>
          <a
            href={waLink("Hi Richie Rich! I want to place an order.")}
            target="_blank"
            rel="noreferrer"
            className="press mt-5 inline-flex items-center gap-2 rounded-full bg-leaf/15 px-4 py-2 text-sm font-bold text-leaf hover:bg-leaf/25"
          >
            <IconWhatsApp className="h-4 w-4" />
            WhatsApp us
          </a>
        </div>

        <div className="text-sm">
          <p className="font-display text-lg tracking-wider text-gold uppercase">Find us</p>
          <ul className="mt-4 space-y-3 text-dim">
            <li className="flex items-start gap-3">
              <IconPin className="mt-0.5 h-4 w-4 text-gold" />
              {RESTAURANT.address}
            </li>
            <li className="flex items-start gap-3">
              <IconClock className="mt-0.5 h-4 w-4 text-gold" />
              {RESTAURANT.hours}
            </li>
            <li className="flex items-start gap-3">
              <IconPhone className="mt-0.5 h-4 w-4 text-gold" />
              <a href="tel:+27655582788" className="hover:text-gold">
                {RESTAURANT.phoneDisplay}
              </a>
            </li>
          </ul>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold">
            <Link href="/menu" className="press rounded-full bg-board2 px-3 py-1.5 text-cream/80 hover:text-gold">
              Full menu
            </Link>
            <Link href="/track" className="press rounded-full bg-board2 px-3 py-1.5 text-cream/80 hover:text-gold">
              Track an order
            </Link>
          </div>
        </div>

        <div className="board p-5">
          <p className="font-display text-lg tracking-wider text-gold uppercase">
            Core Automation Package
          </p>
          <p className="mt-1 text-xs text-dim">
            The rails running this site — live and wired end to end.
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-cream/85">
            {packagePoints.map((p) => (
              <li key={p} className="flex items-start gap-2.5">
                <IconCheck className="mt-1 h-3.5 w-3.5 text-leaf" />
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-gold/20 pt-3 text-xs text-dim">
            R28,000 once-off · R2,000/mo support &amp; hosting · delivered in 10–14 days
          </p>
        </div>
      </div>
      <div className="border-t border-gold/10 py-4 text-center text-xs text-dim">
        © {new Date().getFullYear()} Richie Rich Kota &amp; Shisa Kitchen · Prototype build ·
        Payments simulated for demo
      </div>
    </footer>
  );
}
