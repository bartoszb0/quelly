import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Bell,
  Check,
  ChefHat,
  Clock,
  Link2,
  QrCode,
  Radio,
  ShieldCheck,
  Smartphone,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <TrustStrip />
        <HowItWorks />
        <Features />
        <Showcase />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}

/* ---------------------------------- Header --------------------------------- */

function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <img
            src="/logo.png"
            alt="Quelly"
            className="size-7 object-contain brightness-0 dark:invert"
          />
          <span className="text-base">Quelly</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#how" className="transition-colors hover:text-foreground">
            How it works
          </a>
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#showcase" className="transition-colors hover:text-foreground">
            Live view
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="lg">
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild size="lg">
            <Link to="/register">
              Get started
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

/* ----------------------------------- Hero ---------------------------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* subtle backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklch,var(--foreground)_6%,transparent),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.4] [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]"
      />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
        <div className="flex flex-col items-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Radio className="size-3.5" />
            Live queue tracking for food stalls
          </span>

          <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Turn your line into a{" "}
            <span className="relative whitespace-nowrap">
              live queue
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-1 -z-10 h-3 bg-foreground/10"
              />
            </span>
            .
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-lg text-muted-foreground">
            Take orders, hand out a number, and let guests watch their spot move
            in real time — no app, no account, no crowd at the counter. You stay
            in flow; they stay informed.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-11 px-5 text-sm">
              <Link to="/register">
                Start free
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-11 px-5 text-sm">
              <a href="#how">See how it works</a>
            </Button>
          </div>

          <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {["No card required", "Live in 2 minutes", "Guests need no login"].map(
              (item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="size-4 text-foreground" />
                  {item}
                </li>
              ),
            )}
          </ul>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div
        aria-hidden
        className="absolute -inset-4 -z-10 rounded-[2rem] bg-foreground/[0.03]"
      />
      {/* Guest order ticket */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ChefHat className="size-3.5" />
            Mario&apos;s Tacos
          </span>
          <span className="flex items-center gap-1.5">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-foreground/40" />
              <span className="relative inline-flex size-2 rounded-full bg-foreground" />
            </span>
            Live
          </span>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Your order
          </p>
          <p className="mt-1 text-6xl font-semibold tabular-nums tracking-tight">
            #42
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium">
            <Clock className="size-3.5" />
            In the queue
          </span>
        </div>

        <div className="mt-6 rounded-2xl bg-secondary/60 p-4 text-center">
          <p className="text-sm text-muted-foreground">Orders ahead of you</p>
          <p className="text-3xl font-semibold tabular-nums">3</p>
        </div>

        <div className="mt-6 space-y-2">
          <StatusRow label="Queued" state="done" />
          <StatusRow label="Ready for pickup" state="active" />
          <StatusRow label="Collected" state="todo" />
        </div>
      </div>
    </div>
  );
}

function StatusRow({
  label,
  state,
}: {
  label: string;
  state: "done" | "active" | "todo";
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={
          state === "done"
            ? "flex size-6 items-center justify-center rounded-full bg-foreground text-background"
            : state === "active"
              ? "flex size-6 items-center justify-center rounded-full border-2 border-foreground"
              : "flex size-6 items-center justify-center rounded-full border-2 border-border"
        }
      >
        {state === "done" && <Check className="size-3.5" />}
        {state === "active" && (
          <span className="size-2 rounded-full bg-foreground" />
        )}
      </span>
      <span
        className={
          state === "todo"
            ? "text-sm text-muted-foreground"
            : "text-sm font-medium"
        }
      >
        {label}
      </span>
    </div>
  );
}

/* -------------------------------- Trust strip ------------------------------ */

function TrustStrip() {
  const stats = [
    { value: "0", label: "Apps to install" },
    { value: "1 link", label: "Per shop, shareable anywhere" },
    { value: "<1s", label: "Live status updates" },
    { value: "∞", label: "Orders per shift" },
  ];
  return (
    <section className="border-y border-border/60 bg-secondary/30">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-px overflow-hidden px-6 py-10 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="px-2 text-center">
            <p className="text-3xl font-semibold tracking-tight">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------- How it works ------------------------------ */

function HowItWorks() {
  const steps = [
    {
      icon: Radio,
      title: "Start a shift",
      body: "Open your stall for service in one tap. Order numbers reset cleanly and count up from there.",
    },
    {
      icon: QrCode,
      title: "Take the order",
      body: "Add items, and the guest gets a number. Share your shop link or QR — no app, no sign-up for them.",
    },
    {
      icon: Bell,
      title: "Move it along",
      body: "Tap to mark Ready, then Collected. Every guest's screen updates instantly over a live connection.",
    },
  ];

  return (
    <section id="how" className="mx-auto w-full max-w-6xl px-6 py-20 lg:py-28">
      <SectionHeading
        eyebrow="How it works"
        title="From order to pickup, without the shouting"
        subtitle="Quelly walks every order through a simple flow your guests can follow on their own phone."
      />

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {steps.map((step, i) => (
          <div
            key={step.title}
            className="group relative rounded-2xl border border-border bg-card p-6 transition-colors hover:border-foreground/30"
          >
            <span className="absolute right-6 top-6 text-sm font-medium tabular-nums text-muted-foreground/50">
              0{i + 1}
            </span>
            <span className="flex size-11 items-center justify-center rounded-xl bg-secondary">
              <step.icon className="size-5" />
            </span>
            <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------- Features --------------------------------- */

function Features() {
  const features = [
    {
      icon: Zap,
      title: "Real-time, not refresh",
      body: "Status changes broadcast to every guest watching the same shop the moment you tap. No reloads, no polling.",
    },
    {
      icon: Smartphone,
      title: "Zero friction for guests",
      body: "Guests just type their number on your public page. No download, no account, no email — they watch and walk up.",
    },
    {
      icon: Link2,
      title: "One link per shop",
      body: "Every stall gets its own shareable public link. Print it, QR it, post it — it always points to your live queue.",
    },
    {
      icon: Clock,
      title: "Clean shifts",
      body: "Numbers are scoped to each service session, so they reset every shift and stay easy to call out.",
    },
    {
      icon: ShieldCheck,
      title: "Your data stays yours",
      body: "Owner tools are locked behind secure login; guests only ever see what they need — their order and its place in line.",
    },
    {
      icon: ChefHat,
      title: "Built for the rush",
      body: "Add items fast, advance the queue with a tap, and end a shift to clear out anything still open in one move.",
    },
  ];

  return (
    <section id="features" className="border-t border-border/60 bg-secondary/30">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:py-28">
        <SectionHeading
          eyebrow="Features"
          title="Everything a stall needs, nothing it doesn't"
          subtitle="Purpose-built for fast counters and hungry crowds — no bloated POS, no clutter."
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-card p-6 transition-colors hover:bg-secondary/40"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-secondary">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-5 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Showcase --------------------------------- */

function Showcase() {
  return (
    <section id="showcase" className="mx-auto w-full max-w-6xl px-6 py-20 lg:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Live view"
            title="Two screens, perfectly in sync"
            subtitle="You run the counter; they watch from anywhere in line. The instant you advance an order, their screen catches up."
          />
          <ul className="mt-8 space-y-4">
            {[
              "Guests see their number, their status, and how many orders are ahead.",
              "You see the whole queue and move orders forward with a single tap.",
              "Ending a shift clears every open order at once — start fresh next time.",
            ].map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                  <Check className="size-3" />
                </span>
                <span className="text-sm leading-relaxed text-muted-foreground">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Owner queue mock */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Live queue</p>
              <p className="text-xs text-muted-foreground">Mario&apos;s Tacos · Shift open</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
              <span className="size-1.5 rounded-full bg-foreground" />
              4 in queue
            </span>
          </div>

          <div className="mt-5 space-y-2">
            <QueueItem number={40} item="2× Al pastor" state="ready" />
            <QueueItem number={41} item="Burrito bowl" state="queued" />
            <QueueItem number={42} item="3× Carnitas" state="queued" />
            <QueueItem number={43} item="Quesadilla" state="queued" />
          </div>
        </div>
      </div>
    </section>
  );
}

function QueueItem({
  number,
  item,
  state,
}: {
  number: number;
  item: string;
  state: "ready" | "queued";
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm font-semibold tabular-nums">
        {number}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{item}</p>
        <p className="text-xs text-muted-foreground">
          {state === "ready" ? "Ready for pickup" : "In the queue"}
        </p>
      </div>
      {state === "ready" ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-foreground px-2.5 py-1 text-xs font-medium text-background">
          <Bell className="size-3" />
          Ready
        </span>
      ) : (
        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
          Queued
        </span>
      )}
    </div>
  );
}

/* -------------------------------- Final CTA -------------------------------- */

function FinalCta() {
  return (
    <section className="px-6 pb-24">
      <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-primary px-8 py-16 text-center text-primary-foreground">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:40px_40px]"
        />
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Ready to clear the counter?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-primary-foreground/70">
          Set up your stall, start a shift, and hand out your first number in
          minutes. Free to get started.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="h-11 px-6 text-sm"
          >
            <Link to="/register">
              Create your shop
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="h-11 px-6 text-sm text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <Link to="/login">I already have one</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Footer ---------------------------------- */

function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2 font-medium text-foreground">
          <img
            src="/logo.png"
            alt="Quelly"
            className="size-6 object-contain brightness-0 dark:invert"
          />
          Quelly
        </div>
        <p>© {new Date().getFullYear()} Quelly. Queue smarter.</p>
        <div className="flex items-center gap-6">
          <Link to="/login" className="transition-colors hover:text-foreground">
            Log in
          </Link>
          <Link to="/register" className="transition-colors hover:text-foreground">
            Get started
          </Link>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------- Shared bits ------------------------------- */

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-2xl text-center"
          : "max-w-xl text-left"
      }
    >
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {eyebrow}
      </span>
      <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-pretty text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
