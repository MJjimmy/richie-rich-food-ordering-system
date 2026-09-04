import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { categories, menuItems } from "@/db/schema";
import { Marquee } from "@/components/Marquee";
import { Reveal } from "@/components/Reveal";
import { HomePopular, type PopularSeed } from "@/components/HomePopular";
import { PROVIDERS } from "@/components/PaymentMarks";
import { RESTAURANT } from "@/lib/constants";
import { rand } from "@/lib/format";
import {
  IconArrow,
  IconBag,
  IconBike,
  IconCart,
  IconChef,
  IconClock,
  IconPin,
  IconStar,
  IconWhatsApp,
} from "@/components/icons";

export const dynamic = "force-dynamic";

const TICKER = [
  "Private school kota from R40",
  "Worsroll R25",
  "Shawarma R60",
  "Box meals from R80",
  "Hamburgers from R15",
  "Wrap kota from R40",
  "Kotas from R20",
  "Breakfast from R30",
];

const STEPS = [
  {
    n: "01",
    title: "Pick your pull",
    body: "Scroll the digital board, tap a dish, load extras — wings, cheese, archaar — and drop it in the basket.",
    icon: IconCart,
  },
  {
    n: "02",
    title: "Pay your way",
    body: "Yoco for card, Ozow for instant EFT from any SA bank, PayFast for everything else — or cash at the counter.",
    icon: IconBag,
  },
  {
    n: "03",
    title: "WhatsApp lands",
    body: "The second payment clears, your confirmation and itemised receipt fly to your WhatsApp automatically.",
    icon: IconWhatsApp,
  },
  {
    n: "04",
    title: "Kitchen fires it",
    body: "The order hits the kitchen dashboard on the pass instantly. Track it live from placed to handed over.",
    icon: IconChef,
  },
];

export default async function Home() {
  const [cats, items] = await Promise.all([
    db.select().from(categories).orderBy(asc(categories.sortOrder)),
    db.select().from(menuItems).orderBy(asc(menuItems.sortOrder)),
  ]);

  const catMap = new Map(cats.map((c) => [c.id, c]));
  const seeds: PopularSeed[] = items
    .filter((i) => i.popular && i.available)
    .slice(0, 8)
    .map((i) => ({
      item: i,
      image: catMap.get(i.categoryId)?.image ?? "/images/burger.jpeg",
      category: catMap.get(i.categoryId)?.name ?? "Richie Rich",
    }));

  return (
    <>
      <Marquee items={TICKER} />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(70% 60% at 75% 20%, rgba(255,199,44,.14), transparent 60%), radial-gradient(50% 50% at 10% 90%, rgba(228,87,46,.12), transparent 65%)",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pt-14 pb-16 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:pt-20">
          <div>
            <p className="flex flex-wrap items-center gap-2 text-xs font-bold tracking-[0.22em] text-gold uppercase">
              <IconPin className="h-4 w-4" /> {RESTAURANT.address}
            </p>
            <h1 className="mt-5 font-display text-[13vw] leading-[0.92] uppercase sm:text-6xl lg:text-7xl">
              <span className="mask-line">
                <span style={{ animationDelay: "0.05s" }}>Kota energy.</span>
              </span>
              <span className="mask-line">
                <span style={{ animationDelay: "0.18s" }} className="text-gold">
                  Served hot.
                </span>
              </span>
              <span className="mask-line">
                <span style={{ animationDelay: "0.31s" }}>Paid your way.</span>
              </span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-dim">
              Richie Rich is Pretoria&apos;s home of the private school kota — half-loaf,
              fully loaded, special garlic on everything. Order on your phone, pay with
              Yoco, Ozow or PayFast, and watch it fire on the kitchen dashboard.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/menu"
                className="press group flex items-center gap-3 rounded-full bg-gold px-7 py-3.5 font-display text-lg tracking-wider text-coal uppercase shadow-[5px_5px_0_rgba(0,0,0,.55)] hover:bg-cream"
              >
                Browse the board
                <IconArrow className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#how"
                className="press rounded-full border-2 border-gold/40 px-6 py-3 font-display text-lg tracking-wider text-cream uppercase hover:border-gold hover:text-gold"
              >
                How ordering works
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-dim">
              <span className="flex items-center gap-1.5">
                <IconStar className="h-4 w-4 text-gold" />
                <strong className="text-cream">4.9</strong> from 1,200+ neighbourhood orders
              </span>
              <span className="flex items-center gap-1.5">
                <IconBike className="h-4 w-4 text-gold" /> ±45 min doorstep
              </span>
              <span className="flex items-center gap-1.5">
                <IconClock className="h-4 w-4 text-gold" /> {RESTAURANT.hours}
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="board relative overflow-hidden p-2">
              <div className="overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/burger.jpeg"
                  alt="Loaded private school kota with chips, cheese and special garlic"
                  className="animate-kenburns h-[380px] w-full object-cover sm:h-[460px]"
                />
              </div>
            </div>
            <span className="sticker absolute -top-3 -left-2 -rotate-6 text-lg">
              Worsroll R25
            </span>
            <span className="sticker absolute -right-2 bottom-10 rotate-3 bg-chili text-cream text-lg">
              Shawarma R60
            </span>
            <div className="board absolute -bottom-6 left-6 flex items-center gap-3 px-4 py-3">
              <span className="font-display text-3xl text-gold">R20</span>
              <span className="text-xs leading-tight font-bold text-dim uppercase">
                kotas start
                <br />
                here. yes, R20.
              </span>
            </div>
          </div>
        </div>

        {/* stats strip */}
        <div className="border-y border-gold/15 bg-coal2">
          <div className="mx-auto grid max-w-6xl grid-cols-2 divide-gold/10 px-4 py-6 text-center sm:grid-cols-4 sm:divide-x">
            {[
              ["46", "dishes on the board"],
              ["10", "categories of flavour"],
              ["3", "pay rails + cash"],
              ["±45", "minutes to your door"],
            ].map(([big, small]) => (
              <div key={small} className="py-2">
                <p className="font-display text-4xl text-gold">{big}</p>
                <p className="mt-1 text-xs font-semibold tracking-[0.18em] text-dim uppercase">
                  {small}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORY BOARD */}
      <section className="mx-auto max-w-6xl px-4 pt-16">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.28em] text-gold uppercase">The board</p>
              <h2 className="mt-2 font-display text-4xl text-cream uppercase sm:text-5xl">
                Ten ways to eat <span className="text-gold">rich</span>
              </h2>
            </div>
            <Link
              href="/menu"
              className="press group flex items-center gap-2 rounded-full border-2 border-gold/40 px-5 py-2.5 font-display tracking-wider text-cream uppercase hover:border-gold hover:text-gold"
            >
              Full menu <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((c, idx) => {
            const catItems = items.filter((i) => i.categoryId === c.id && i.available);
            const from = Math.min(...catItems.map((i) => i.priceCents));
            return (
              <Reveal key={c.id} delay={(idx % 3) * 90}>
                <Link
                  href={`/menu#${c.slug}`}
                  className="group board block overflow-hidden transition-transform duration-300 hover:-translate-y-1.5"
                >
                  <div className="relative h-44 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.image}
                      alt={c.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <span className="sticker absolute bottom-3 left-3 text-base">
                      from {rand(from)}
                    </span>
                    <span className="absolute top-3 right-3 rounded-full bg-coal/80 px-3 py-1 text-xs font-bold text-gold">
                      {catItems.length} items
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-2xl tracking-wide text-cream uppercase group-hover:text-gold">
                      {c.name}
                    </h3>
                    <p className="mt-1 text-sm text-dim">{c.tagline}</p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* MOST ORDERED */}
      <section className="mx-auto max-w-6xl px-4 pt-20">
        <Reveal>
          <p className="text-xs font-bold tracking-[0.28em] text-gold uppercase">Most ordered</p>
          <h2 className="mt-2 font-display text-4xl text-cream uppercase sm:text-5xl">
            The neighbourhood&apos;s <span className="text-gold">favourites</span>
          </h2>
        </Reveal>
        <div className="mt-8">
          <HomePopular seeds={seeds} />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-20">
        <Reveal>
          <p className="text-xs font-bold tracking-[0.28em] text-gold uppercase">
            Zero manual WhatsApp typing
          </p>
          <h2 className="mt-2 max-w-2xl font-display text-4xl text-cream uppercase sm:text-5xl">
            From craving to kitchen in <span className="text-gold">four moves</span>
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 100}>
              <div className="board group relative h-full p-6 transition-transform duration-300 hover:-translate-y-1.5">
                <span className="font-display text-5xl text-gold/25 transition-colors group-hover:text-gold/50">
                  {s.n}
                </span>
                <span className="absolute top-6 right-6 grid h-11 w-11 place-items-center rounded-full bg-gold text-coal shadow-[3px_3px_0_rgba(0,0,0,.5)]">
                  <s.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-xl tracking-wide text-cream uppercase">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-dim">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* payment rails */}
        <Reveal delay={120}>
          <div className="board mt-8 flex flex-col items-start gap-6 p-6 lg:flex-row lg:items-center">
            <div className="lg:w-1/3">
              <h3 className="font-display text-2xl tracking-wide text-cream uppercase">
                South African <span className="text-gold">pay rails</span>
              </h3>
              <p className="mt-1 text-sm text-dim">
                Gateways wired at setup — card, instant EFT and cash all reconcile to the
                same kitchen ticket.
              </p>
            </div>
            <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
              {PROVIDERS.map((p) => (
                <div
                  key={p.id}
                  className="press rounded-xl border border-gold/25 bg-coal/60 p-4 text-center hover:border-gold/60 hover:bg-coal"
                >
                  <p.Mark className="mx-auto h-7 w-7 text-gold" />
                  <p className="mt-2 font-display text-lg tracking-wider text-cream uppercase">
                    {p.name}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-tight text-dim">{p.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
