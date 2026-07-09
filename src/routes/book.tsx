import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Hammer,
  PackageOpen,
  Truck,
  Wrench,
  Home,
  Minus,
  Plus,
  Check,
  ArrowRight,
} from "lucide-react";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book a cleaning — Ino Cleaning Services" },
      { name: "description", content: "Build your cleaning booking in a few taps. Live pricing for rooms, sofas, carpets and add-ons." },
    ],
  }),
  component: BookPage,
});

type JobType = { id: string; label: string; icon: typeof Sparkles };

const JOB_TYPES: JobType[] = [
  { id: "deep", label: "Deep Cleaning", icon: Sparkles },
  { id: "post", label: "Post Construction", icon: Hammer },
  { id: "in", label: "Move In Cleaning", icon: PackageOpen },
  { id: "out", label: "Move Out Cleaning", icon: Truck },
  { id: "renovated", label: "Renovated House", icon: Wrench },
  { id: "living", label: "Living In Cleaning", icon: Home },
];

const ROOMS = [
  { id: "bedroom", label: "Bedroom", price: 250 },
  { id: "hall", label: "Hall", price: 300 },
  { id: "kitchen", label: "Kitchen", price: 300 },
  { id: "washroom", label: "Washroom", price: 250 },
  { id: "garage", label: "Garage", price: 150 },
  { id: "balcony", label: "Balcony / Veranda", price: 150 },
  { id: "store", label: "Store", price: 200 },
  { id: "study", label: "Study", price: 200 },
  { id: "dining", label: "Dining", price: 250 },
];

const SOFAS = [
  { id: "s1", label: "1-in-1", price: 130 },
  { id: "s2", label: "2-in-1", price: 260 },
  { id: "s3", label: "3-in-1", price: 390 },
  { id: "sl", label: "L-Shaped", price: 450 },
];

const CARPETS = [
  { id: "cs", label: "Small", price: 100 },
  { id: "cm", label: "Medium", price: 250 },
  { id: "cl", label: "Large", price: 350 },
];

const CONDITIONS = [
  { id: "paint", label: "Paint or POP residue", price: 300 },
  { id: "stains", label: "Tough stains", price: 200 },
  { id: "dirty", label: "Heavily soiled", price: 300 },
  { id: "popdirty", label: "POP residue + very dirty", price: 500 },
];

function fmt(n: number) {
  return `GH₵${n.toLocaleString()}`;
}

function BookPage() {
  const [job, setJob] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Record<string, number>>({});
  const [sofas, setSofas] = useState<Record<string, number>>({});
  const [carpets, setCarpets] = useState<Record<string, number>>({});
  const [conds, setConds] = useState<Record<string, boolean>>({});
  const [windows, setWindows] = useState(0);
  const [contact, setContact] = useState({ name: "", phone: "", location: "", date: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  const bump = (
    setter: React.Dispatch<React.SetStateAction<Record<string, number>>>,
    id: string,
    delta: number,
  ) => setter((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] ?? 0) + delta) }));

  const total = useMemo(() => {
    let t = 0;
    for (const r of ROOMS) t += (rooms[r.id] ?? 0) * r.price;
    for (const s of SOFAS) t += (sofas[s.id] ?? 0) * s.price;
    for (const c of CARPETS) t += (carpets[c.id] ?? 0) * c.price;
    for (const c of CONDITIONS) if (conds[c.id]) t += c.price;
    t += windows * 50;
    return t;
  }, [rooms, sofas, carpets, conds, windows]);

  const canSubmit = job && total > 0 && contact.name && contact.phone && contact.location;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <section className="border-b border-border bg-[color:var(--muted)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--primary-deep)]">Book a cleaning</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Build your booking</h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Choose a service and rooms — your estimate updates live. Final price is confirmed after an on-site check.
            </p>
          </Reveal>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.section
            key="done"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6"
          >
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-md bg-primary/15 text-[color:var(--primary-deep)]">
              <Check className="h-8 w-8" />
            </div>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight">Booking request received</h2>
            <p className="mt-3 text-muted-foreground">
              Thanks {contact.name.split(" ")[0]}! We'll call {contact.phone} shortly to confirm your booking and share the final quote.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm">
              Estimated total: <span className="font-semibold text-[color:var(--primary-deep)]">{fmt(total)}</span>
            </div>
          </motion.section>
        ) : (
          <motion.form
            key="form"
            onSubmit={submit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_360px]"
          >
            <div className="space-y-10">
              <Step number="1" title="Type of job">
                <div className="grid gap-3 sm:grid-cols-2">
                  {JOB_TYPES.map((j) => {
                    const active = job === j.id;
                    return (
                      <button
                        key={j.id}
                        type="button"
                        onClick={() => setJob(j.id)}
                        className={`group flex items-center gap-3 rounded-md border p-4 text-left transition-all ${
                          active
                            ? "border-primary bg-primary/5 shadow-[var(--shadow-soft)]"
                            : "border-border bg-card hover:border-primary/40"
                        }`}
                      >
                        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-md ${active ? "bg-primary text-primary-foreground" : "bg-primary/10 text-[color:var(--primary-deep)]"}`}>
                          <j.icon className="h-5 w-5" />
                        </span>
                        <span className="text-sm font-medium">{j.label}</span>
                      </button>
                    );
                  })}
                </div>
              </Step>

              <Step number="2" title="Rooms">
                <div className="divide-y divide-border rounded-md border border-border bg-card">
                  {ROOMS.map((r) => (
                    <Counter
                      key={r.id}
                      label={r.label}
                      sub={`${fmt(r.price)} each`}
                      value={rooms[r.id] ?? 0}
                      onChange={(d) => bump(setRooms, r.id, d)}
                    />
                  ))}
                </div>
              </Step>

              <Step number="3" title="Sofa cleaning">
                <div className="grid gap-3 sm:grid-cols-2">
                  {SOFAS.map((s) => (
                    <TileCounter
                      key={s.id}
                      label={s.label}
                      price={fmt(s.price)}
                      value={sofas[s.id] ?? 0}
                      onChange={(d) => bump(setSofas, s.id, d)}
                    />
                  ))}
                </div>
              </Step>

              <Step number="4" title="Carpet cleaning">
                <div className="grid gap-3 sm:grid-cols-3">
                  {CARPETS.map((c) => (
                    <TileCounter
                      key={c.id}
                      label={c.label}
                      price={`${fmt(c.price)} each`}
                      value={carpets[c.id] ?? 0}
                      onChange={(d) => bump(setCarpets, c.id, d)}
                    />
                  ))}
                </div>
              </Step>

              <Step number="5" title="Special conditions">
                <div className="grid gap-3 sm:grid-cols-2">
                  {CONDITIONS.map((c) => {
                    const active = !!conds[c.id];
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setConds((p) => ({ ...p, [c.id]: !p[c.id] }))}
                        className={`flex items-center justify-between rounded-md border p-4 text-left transition-all ${
                          active ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"
                        }`}
                      >
                        <div>
                          <div className="text-sm font-medium">{c.label}</div>
                          <div className="text-xs text-muted-foreground">+{fmt(c.price)}</div>
                        </div>
                        <span className={`grid h-6 w-6 place-items-center rounded-md border ${active ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                          {active && <Check className="h-3.5 w-3.5" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Step>

              <Step number="6" title="Windows">
                <div className="rounded-md border border-border bg-card">
                  <Counter
                    label="Windows"
                    sub="GH₵50 per window"
                    value={windows}
                    onChange={(d) => setWindows((v) => Math.max(0, v + d))}
                  />
                </div>
              </Step>

              <Step number="7" title="Your details">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full name" required>
                    <input
                      required
                      value={contact.name}
                      onChange={(e) => setContact({ ...contact, name: e.target.value })}
                      className="input"
                      placeholder="Ama Owusu"
                    />
                  </Field>
                  <Field label="Phone" required>
                    <input
                      required
                      value={contact.phone}
                      onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                      className="input"
                      placeholder="0530 268 611"
                    />
                  </Field>
                  <Field label="Location" required>
                    <input
                      required
                      value={contact.location}
                      onChange={(e) => setContact({ ...contact, location: e.target.value })}
                      className="input"
                      placeholder="Ayeduase, near KNUST"
                    />
                  </Field>
                  <Field label="Preferred date">
                    <input
                      type="date"
                      value={contact.date}
                      onChange={(e) => setContact({ ...contact, date: e.target.value })}
                      className="input"
                    />
                  </Field>
                  <Field label="Notes" className="sm:col-span-2">
                    <textarea
                      rows={3}
                      value={contact.notes}
                      onChange={(e) => setContact({ ...contact, notes: e.target.value })}
                      className="input"
                      placeholder="Anything we should know?"
                    />
                  </Field>
                </div>
              </Step>
            </div>

            {/* Sticky summary */}
            <aside className="lg:sticky lg:top-24 lg:h-fit">
              <div className="rounded-md border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Estimate</p>
                <div className="mt-2 text-4xl font-semibold tracking-tight text-[color:var(--primary-deep)]">
                  {fmt(total)}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  All prices in GH₵. Final price confirmed after on-site assessment.
                </p>

                <div className="mt-6 space-y-2 text-sm">
                  <SummaryLine label="Service" value={JOB_TYPES.find((j) => j.id === job)?.label ?? "—"} />
                  <SummaryLine
                    label="Rooms"
                    value={String(Object.values(rooms).reduce((a, b) => a + b, 0))}
                  />
                  <SummaryLine
                    label="Sofas"
                    value={String(Object.values(sofas).reduce((a, b) => a + b, 0))}
                  />
                  <SummaryLine
                    label="Carpets"
                    value={String(Object.values(carpets).reduce((a, b) => a + b, 0))}
                  />
                  <SummaryLine label="Windows" value={String(windows)} />
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  Request booking <ArrowRight className="h-4 w-4" />
                </button>
                {!canSubmit && (
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    Pick a service, add rooms and fill your details to continue.
                  </p>
                )}
              </div>
            </aside>
          </motion.form>
        )}
      </AnimatePresence>

      <SiteFooter />

      <style>{`
        .input {
          width: 100%;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          background: var(--background);
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          color: var(--foreground);
          outline: none;
          transition: border-color .15s, box-shadow .15s;
        }
        .input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--primary) 20%, transparent);
        }
      `}</style>
    </div>
  );
}

function Step({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <div>
        <div className="mb-4 flex items-center gap-3">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-primary/15 text-xs font-semibold text-[color:var(--primary-deep)]">
            {number}
          </span>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        </div>
        {children}
      </div>
    </Reveal>
  );
}

function Counter({
  label,
  sub,
  value,
  onChange,
}: {
  label: string;
  sub?: string;
  value: number;
  onChange: (delta: number) => void;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-4">
      <div className="min-w-0">
        <div className="truncate text-sm font-medium">{label}</div>
        {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <IconBtn onClick={() => onChange(-1)} disabled={value === 0}>
          <Minus className="h-4 w-4" />
        </IconBtn>
        <span className="w-6 text-center text-sm font-medium tabular-nums">{value}</span>
        <IconBtn onClick={() => onChange(1)}>
          <Plus className="h-4 w-4" />
        </IconBtn>
      </div>
    </div>
  );
}

function TileCounter({
  label,
  price,
  value,
  onChange,
}: {
  label: string;
  price: string;
  value: number;
  onChange: (delta: number) => void;
}) {
  const active = value > 0;
  return (
    <div
      className={`rounded-md border p-4 transition-all ${active ? "border-primary bg-primary/5" : "border-border bg-card"}`}
    >
      <div className="text-sm font-medium">{label}</div>
      <div className="text-xs text-muted-foreground">{price}</div>
      <div className="mt-3 flex items-center justify-between">
        <IconBtn onClick={() => onChange(-1)} disabled={value === 0}>
          <Minus className="h-4 w-4" />
        </IconBtn>
        <span className="text-sm font-semibold tabular-nums">{value}</span>
        <IconBtn onClick={() => onChange(1)}>
          <Plus className="h-4 w-4" />
        </IconBtn>
      </div>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="grid h-8 w-8 place-items-center rounded-md border border-border bg-background text-foreground transition-colors hover:border-primary hover:text-[color:var(--primary-deep)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border"
    >
      {children}
    </button>
  );
}

function Field({
  label,
  required,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label} {required && <span className="text-[color:var(--primary)]">*</span>}
      </span>
      {children}
    </label>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}