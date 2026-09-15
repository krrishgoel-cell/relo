import { useState, type FormEvent } from "react";
import { supabase } from "./lib/supabase";

function MacDots() {
  return (
    <div className="flex gap-1.5">
      <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
    </div>
  );
}

type RowStatus = "blocked" | "ready" | "auto" | "todo";

function statusBadge(status: RowStatus) {
  switch (status) {
    case "blocked":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
          Blocked
        </span>
      );
    case "ready":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
          Ready
        </span>
      );
    case "auto":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
          Automatic
        </span>
      );
    case "todo":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600">
          Needs action
        </span>
      );
  }
}

function ChecklistRow({
  name,
  detail,
  status,
}: {
  name: string;
  detail: string;
  status: RowStatus;
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-3 last:border-0">
      <div>
        <p className="text-sm font-medium text-ink">{name}</p>
        <p className="text-xs text-gray-500">{detail}</p>
      </div>
      {statusBadge(status)}
    </div>
  );
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!supabase) {
      setStatus("error");
      setErrorMessage("Signups aren't connected yet. Check back soon.");
      return;
    }

    setStatus("loading");
    const { error } = await supabase
      .from("waitlist")
      .insert({ email: email.trim().toLowerCase() });

    if (error) {
      setStatus("error");
      setErrorMessage(
        error.code === "23505"
          ? "That email is already on the list."
          : "Something went wrong. Try again in a moment."
      );
      return;
    }

    setStatus("success");
    setEmail("");
  }

  if (status === "success") {
    return (
      <p className="mx-auto mt-8 max-w-md text-sm font-medium text-emerald-700">
        You're on the list. We'll email you when the checklist is ready.
      </p>
    );
  }

  return (
    <div className="mx-auto mt-8 max-w-md">
      <form
        className="flex flex-col gap-3 sm:flex-row"
        onSubmit={handleSubmit}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="whitespace-nowrap rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
        >
          {status === "loading" ? "Joining..." : "Get the free checklist"}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      className="text-sm text-gray-600 transition-colors hover:text-ink"
    >
      {children}
    </a>
  );
}

function SectionEyebrow({ children }: { children: string }) {
  return (
    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
      <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
      {children}
    </p>
  );
}

const stats = [
  {
    value: "304M",
    label: "people already live outside the country they were born in",
    source: "UN DESA, 2024",
    href: "https://www.un.org/development/desa/pd/sites/www.un.org.development.desa.pd/files/undesa_pd_2025_intlmigstock_2024_key_facts_and_figures_advance-unedited.pdf",
  },
  {
    value: "8+",
    label: "active subscriptions the average person is juggling right now",
    source: "Industry subscription surveys, 2025",
    href: "https://www.lowermysubs.com/blog/subscription-statistics",
  },
  {
    value: "78%",
    label: "of adults worldwide pay for at least one subscription",
    source: "Zuora Subscription Economy Index, 2025",
    href: "https://www.sci-tech-today.com/stats/subscription-economy-statistics/",
  },
  {
    value: "0",
    label: "relocation apps we could find that cover any of this",
    source: "Relo's own research, 2026",
  },
];

const losses = [
  "Every app, movie, and book you've ever bought, locked behind a region you no longer live in",
  "Family sharing broken for everyone else still on your plan",
  "Two-factor codes sent to a phone number that doesn't ring anymore",
  "Watch history, playlists, and loyalty points reset the moment the account resets",
  "A support queue that can take weeks, arriving exactly when you have the least time to wait",
];

const coverage = [
  {
    title: "Apple ID subscriptions",
    detail: "Region locks, leftover balance, family sharing plans",
    badge: "bg-gray-900",
    letter: "A",
  },
  {
    title: "Google Play subscriptions",
    detail: "Country changes, active subscriptions on file",
    badge: "bg-emerald-600",
    letter: "G",
  },
  {
    title: "Steam",
    detail: "Wallet funds, regional pricing",
    badge: "bg-slate-700",
    letter: "S",
  },
  {
    title: "Netflix & streaming",
    detail: "Plan changes, billing country",
    badge: "bg-red-600",
    letter: "N",
  },
  {
    title: "Spotify & music apps",
    detail: "Plans still billing through your old card",
    badge: "bg-green-600",
    letter: "M",
  },
  {
    title: "Regional streaming apps",
    detail: "Hotstar, Peacock, ITVX, and other country-only plans",
    badge: "bg-purple-600",
    letter: "R",
  },
];

const steps = [
  {
    number: "01",
    title: "Tell us where you're going",
    body: "Enter your current country and your next one. We already know which subscriptions are affected.",
  },
  {
    number: "02",
    title: "Get the exact steps",
    body: "A checklist built for your specific move, not a generic guide, with the right screens and support links for each platform.",
  },
  {
    number: "03",
    title: "Hand off the annoying parts",
    body: "Stuck on something like a locked balance or a support ticket that needs a phone call? Tell us and we'll take it from there.",
  },
];

function App() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-paper">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold">Relo</span>
          <nav className="hidden items-center gap-8 md:flex">
            <NavLink href="#how-it-works">How it works</NavLink>
            <NavLink href="#coverage">What we cover</NavLink>
            <NavLink href="#checklist">Get the checklist</NavLink>
          </nav>
          <a
            href="#checklist"
            className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-black"
          >
            Get early access
          </a>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-6 pb-20 pt-12 md:pt-16">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="grid md:grid-cols-2">
              <div className="flex flex-col justify-center px-6 py-10 md:px-10 md:py-12">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                  The move nobody plans for
                </span>
                <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight md:text-4xl">
                  You pack the apartment.
                  <br />
                  Nobody packs your accounts.
                </h1>
                <p className="mt-4 text-base text-gray-600">
                  A flight can move your body in a day. Your digital life
                  takes longer, and Relo is the checklist that catches it
                  before you land.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a
                    href="#checklist"
                    className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                  >
                    Get the free checklist
                  </a>
                  <a
                    href="#how-it-works"
                    className="rounded-lg border border-gray-300 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-ink transition-colors hover:border-gray-400"
                  >
                    See how it works
                  </a>
                </div>
              </div>

              <div className="grid-pattern flex flex-col justify-center border-t border-gray-200 bg-gray-50 px-6 py-10 md:border-l md:border-t-0 md:px-10">
                <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                  Live checklist · scored by what actually breaks
                </p>
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <MacDots />
                    <span className="font-mono text-xs text-gray-400">
                      relo · moving
                    </span>
                  </div>
                  <div className="pt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">
                        Brazil <span className="text-gray-400">→</span>{" "}
                        Portugal
                      </p>
                      <span className="text-xs text-gray-400">
                        3 of 4 checked
                      </span>
                    </div>
                    <div className="mt-3">
                      <ChecklistRow
                        name="Apple ID region"
                        detail="$0.01 balance remaining"
                        status="blocked"
                      />
                      <ChecklistRow
                        name="Google Play subscriptions"
                        detail="Nothing active, ready to switch"
                        status="ready"
                      />
                      <ChecklistRow
                        name="Netflix plan"
                        detail="Cancels automatically on switch"
                        status="auto"
                      />
                      <ChecklistRow
                        name="Spotify Premium"
                        detail="Still billed through the old card"
                        status="todo"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <SectionEyebrow>Why this matters more than it looks</SectionEyebrow>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
              Your digital life moved with you a long time ago.
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-gray-600">
              Moving used to mean packing boxes. Now it also means
              untangling a digital life that's just as real, and just as
              easy to lose.
            </p>
            <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white p-6">
                  <p className="text-4xl font-bold tracking-tight text-ink md:text-5xl">
                    {stat.value}
                  </p>
                  <p className="mt-3 text-sm text-gray-600">{stat.label}</p>
                  <p className="mt-4 text-xs text-gray-400">
                    {stat.href ? (
                      <a
                        href={stat.href}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-gray-600"
                      >
                        {stat.source}
                      </a>
                    ) : (
                      stat.source
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-gray-200">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <SectionEyebrow>It's not just an inconvenience</SectionEyebrow>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
              Here's what actually gets lost.
            </h2>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {losses.map((loss) => (
                <div
                  key={loss}
                  className="flex h-full items-start gap-4 rounded-xl border border-gray-200 bg-white p-5"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-50 text-sm font-bold text-red-600">
                    !
                  </span>
                  <p className="text-gray-700">{loss}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="grid gap-10 rounded-2xl border border-amber-200 bg-amber-50/60 p-8 md:grid-cols-2 md:gap-16 md:p-12">
              <div>
                <SectionEyebrow>A case in point</SectionEyebrow>
                <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                  A one-cent balance can block your entire move.
                </h2>
              </div>
              <p className="text-lg text-gray-700">
                Apple won't let you change your country while you have any
                Apple ID balance left, even a single cent. You can't cash it
                out, and there's nothing in the store that costs less than a
                dollar, so you can't spend it away either. Most people find
                this out mid-move, right when they're also dealing with a
                new apartment, a new SIM card, and a dozen other things that
                actually matter. It's a small bug with a disproportionate
                amount of friction, and it's not even the only one. Google
                Play, Steam, and Spotify each have their own version of it.
              </p>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-20">
          <SectionEyebrow>How it works</SectionEyebrow>
          <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight md:text-4xl">
            Three steps, done before you land.
          </h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number}>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
                  {step.number}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="coverage" className="border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <SectionEyebrow>What we cover</SectionEyebrow>
            <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight md:text-4xl">
              The subscriptions that actually break.
            </h2>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {coverage.map((item) => (
                <div
                  key={item.title}
                  className="h-full rounded-xl border border-gray-200 p-5 transition-shadow hover:shadow-md"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white ${item.badge}`}
                  >
                    {item.letter}
                  </div>
                  <p className="mt-4 font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-gray-600">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-gray-200">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="grid gap-8 rounded-2xl border border-gray-200 bg-white p-8 md:grid-cols-[1.2fr_1fr] md:items-center md:p-12">
              <div>
                <SectionEyebrow>Stuck on something?</SectionEyebrow>
                <h2 className="mt-3 text-3xl font-bold tracking-tight">
                  We'll finish it for you.
                </h2>
                <p className="mt-4 text-gray-600">
                  Some of this can't be done from a settings menu. It needs a
                  support ticket, a phone call, or a form only the platform
                  can process. If you'd rather skip that, tell us and we'll
                  handle it through the platform's own official channels,
                  asking your permission before anything happens. No VPNs, no
                  shortcuts that could get your account flagged.
                </p>
              </div>
              <div className="flex md:justify-end">
                <a
                  href="#checklist"
                  className="rounded-lg bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
                >
                  Ask us to handle it
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="checklist" className="border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-20 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Your digital life deserves a plan too.
            </h2>
            <p className="mt-3 text-gray-600">
              Free to use. Takes about two minutes.
            </p>
            <WaitlistForm />
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-gray-500 md:flex-row">
          <p>Relo, for the parts of the move nobody packs.</p>
          <div className="flex gap-6">
            <NavLink href="#how-it-works">How it works</NavLink>
            <NavLink href="#coverage">What we cover</NavLink>
            <NavLink href="#checklist">Contact</NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
