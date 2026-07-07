import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ORDER_STATUS_STYLE } from "@/constants/orderStatus";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/OrderStatus";
import {
  ArrowRight,
  Bell,
  Check,
  CheckCheck,
  ChefHat,
  Clock,
  Hourglass,
  Link2,
  QrCode,
  Radio,
  ShieldCheck,
  Smartphone,
  X,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";
import { Trans, useTranslation } from "react-i18next";
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
  const { t } = useTranslation("home");

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
            {t("nav.how")}
          </a>
          <a href="#features" className="transition-colors hover:text-foreground">
            {t("nav.features")}
          </a>
          <a href="#showcase" className="transition-colors hover:text-foreground">
            {t("nav.showcase")}
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher className="mr-1 hidden sm:flex" />
          <Button asChild variant="ghost" size="lg">
            <Link to="/login">{t("nav.logIn")}</Link>
          </Button>
          <Button asChild size="lg">
            <Link to="/register">
              {t("nav.getStarted")}
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
  const { t } = useTranslation("home");

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
            {t("hero.badge")}
          </span>

          <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            <Trans
              t={t}
              i18nKey="hero.title"
              components={{ highlight: <Highlight /> }}
            />
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-lg text-muted-foreground">
            {t("hero.subtitle")}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-11 px-5 text-sm">
              <Link to="/register">
                {t("hero.startFree")}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-11 px-5 text-sm">
              <a href="#how">{t("hero.seeHow")}</a>
            </Button>
          </div>

          <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {[t("hero.check1"), t("hero.check2"), t("hero.check3")].map(
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

// Marked-up hero words: renders its children over the brand underline.
function Highlight({ children }: { children?: ReactNode }) {
  return (
    <span className="relative whitespace-nowrap">
      {children}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-1 -z-10 h-3 bg-foreground/10"
      />
    </span>
  );
}

function HeroVisual() {
  const { t } = useTranslation("home");

  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div
        aria-hidden
        className="absolute -inset-4 -z-10 rounded-[2rem] bg-foreground/[0.03]"
      />
      {/* A faithful mock of the live guest order page. */}
      <div className="flex flex-col items-center gap-6 rounded-3xl border border-border bg-card px-8 py-10 text-center shadow-sm">
        {/* Status icon ring */}
        <div className="flex size-20 items-center justify-center rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400">
          <Hourglass className="size-9 animate-pulse" />
        </div>

        {/* Order number */}
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {t("guest:yourNumber")}
          </p>
          <p className="mt-1 text-7xl font-bold tracking-tight tabular-nums">
            #42
          </p>
        </div>

        {/* Status pill + message */}
        <div className="flex flex-col items-center gap-3">
          <span className="rounded-full bg-sky-500/10 px-3 py-1 text-sm font-medium text-sky-600 dark:text-sky-400">
            {t("common:status.QUEUED")}
          </span>
          <p className="text-base">{t("guest:message.aheadOfYou", { count: 3 })}</p>
        </div>

        {/* Progress stepper — Queued → Ready → Collected */}
        <div className="w-full">
          <div className="flex items-center">
            <div className="size-3 shrink-0 rounded-full bg-primary" />
            <div className="h-0.5 flex-1 rounded-full bg-muted" />
            <div className="size-3 shrink-0 rounded-full bg-muted" />
            <div className="h-0.5 flex-1 rounded-full bg-muted" />
            <div className="size-3 shrink-0 rounded-full bg-muted" />
          </div>
          <div className="mt-2 flex justify-between text-xs">
            <span className="font-medium text-foreground">
              {t("common:status.QUEUED")}
            </span>
            <span className="text-muted-foreground">
              {t("common:status.READY")}
            </span>
            <span className="text-muted-foreground">
              {t("common:status.COLLECTED")}
            </span>
          </div>
        </div>

        {/* Order items */}
        <div className="w-full rounded-xl border border-border p-4">
          <ul className="flex flex-col gap-1 text-sm">
            <li className="flex items-center justify-between gap-4">
              <span>{t("mock.carnitasTaco")}</span>
              <span className="tabular-nums text-muted-foreground">×3</span>
            </li>
            <li className="flex items-center justify-between gap-4">
              <span>{t("mock.alPastor")}</span>
              <span className="tabular-nums text-muted-foreground">×1</span>
            </li>
          </ul>
        </div>

        {/* Live indicator */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            {t("guest:updatingLive")}
          </div>
          <p className="text-xs text-muted-foreground">
            {t("guest:placedAt", { time: "12:45" })}
          </p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- Trust strip ------------------------------ */

function TrustStrip() {
  const { t } = useTranslation("home");

  const stats = [
    { value: t("stats.value1"), label: t("stats.label1") },
    { value: t("stats.value2"), label: t("stats.label2") },
    { value: t("stats.value3"), label: t("stats.label3") },
    { value: t("stats.value4"), label: t("stats.label4") },
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
  const { t } = useTranslation("home");

  const steps = [
    { icon: Radio, title: t("how.step1Title"), body: t("how.step1Body") },
    { icon: QrCode, title: t("how.step2Title"), body: t("how.step2Body") },
    { icon: Bell, title: t("how.step3Title"), body: t("how.step3Body") },
  ];

  return (
    <section id="how" className="mx-auto w-full max-w-6xl px-6 py-20 lg:py-28">
      <SectionHeading
        eyebrow={t("how.eyebrow")}
        title={t("how.title")}
        subtitle={t("how.subtitle")}
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
  const { t } = useTranslation("home");

  const features = [
    { icon: Zap, title: t("features.f1Title"), body: t("features.f1Body") },
    {
      icon: Smartphone,
      title: t("features.f2Title"),
      body: t("features.f2Body"),
    },
    { icon: Link2, title: t("features.f3Title"), body: t("features.f3Body") },
    { icon: Clock, title: t("features.f4Title"), body: t("features.f4Body") },
    {
      icon: ShieldCheck,
      title: t("features.f5Title"),
      body: t("features.f5Body"),
    },
    { icon: ChefHat, title: t("features.f6Title"), body: t("features.f6Body") },
  ];

  return (
    <section id="features" className="border-t border-border/60 bg-secondary/30">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:py-28">
        <SectionHeading
          eyebrow={t("features.eyebrow")}
          title={t("features.title")}
          subtitle={t("features.subtitle")}
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
  const { t } = useTranslation("home");

  return (
    <section id="showcase" className="mx-auto w-full max-w-6xl px-6 py-20 lg:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            align="left"
            eyebrow={t("showcase.eyebrow")}
            title={t("showcase.title")}
            subtitle={t("showcase.subtitle")}
          />
          <ul className="mt-8 space-y-4">
            {[
              t("showcase.point1"),
              t("showcase.point2"),
              t("showcase.point3"),
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

        {/* Owner order board — mirrors the live orders section. */}
        <div className="rounded-3xl border border-border bg-secondary/30 p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between px-1">
            <div>
              <p className="text-sm font-semibold">{t("showcase.panelTitle")}</p>
              <p className="text-xs text-muted-foreground">
                {t("showcase.panelMeta")}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              {t("showcase.live")}
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <MockOrderCard
              number={40}
              status="READY"
              items={[{ name: t("mock.alPastor"), qty: 2 }]}
            />
            <MockOrderCard
              number={41}
              status="QUEUED"
              items={[{ name: t("mock.burritoBowl"), qty: 1 }]}
            />
            <MockOrderCard
              number={42}
              status="QUEUED"
              items={[{ name: t("mock.carnitas"), qty: 3 }]}
            />
            <MockOrderCard
              number={43}
              status="COLLECTED"
              items={[{ name: t("mock.quesadilla"), qty: 1 }]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function MockOrderCard({
  number,
  status,
  items,
}: {
  number: number;
  status: OrderStatus;
  items: { name: string; qty: number }[];
}) {
  const { t } = useTranslation("shop");
  const isTerminal = status === "COLLECTED" || status === "CANCELLED";

  return (
    <Card className={cn("gap-3 p-4", isTerminal && "opacity-60")}>
      <div className="flex items-center justify-between gap-4">
        <p className="font-medium">#{number}</p>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
            ORDER_STATUS_STYLE[status],
          )}
        >
          {t(`common:status.${status}`)}
        </span>
      </div>

      <ul className="flex flex-col gap-1 text-sm">
        {items.map((item) => (
          <li
            key={item.name}
            className="flex items-center justify-between gap-4 text-muted-foreground"
          >
            <span>{item.name}</span>
            <span className="tabular-nums">×{item.qty}</span>
          </li>
        ))}
      </ul>

      {!isTerminal && (
        <div className="flex items-center gap-2">
          {status === "QUEUED" && (
            <Button size="sm" className="flex-1" type="button" tabIndex={-1}>
              <Check />
              {t("console.ready")}
            </Button>
          )}
          {status === "READY" && (
            <Button size="sm" className="flex-1" type="button" tabIndex={-1}>
              <CheckCheck />
              {t("console.collected")}
            </Button>
          )}
          <Button size="sm" variant="destructive" type="button" tabIndex={-1}>
            <X />
            {t("console.cancel")}
          </Button>
        </div>
      )}
    </Card>
  );
}

/* -------------------------------- Final CTA -------------------------------- */

function FinalCta() {
  const { t } = useTranslation("home");

  return (
    <section className="px-6 pb-24">
      <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-primary px-8 py-16 text-center text-primary-foreground">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:40px_40px]"
        />
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("cta.title")}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-primary-foreground/70">
          {t("cta.body")}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="h-11 px-6 text-sm"
          >
            <Link to="/register">
              {t("cta.createShop")}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="h-11 px-6 text-sm text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <Link to="/login">{t("cta.haveOne")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Footer ---------------------------------- */

function SiteFooter() {
  const { t } = useTranslation("home");

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
        <p>{t("footer.rights", { year: new Date().getFullYear() })}</p>
        <div className="flex items-center gap-6">
          <Link to="/login" className="transition-colors hover:text-foreground">
            {t("footer.logIn")}
          </Link>
          <Link to="/register" className="transition-colors hover:text-foreground">
            {t("footer.getStarted")}
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
