import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Home,
  Building2,
  Store,
  Sofa,
  Hammer,
  PartyPopper,
  Sparkles,
  ShieldCheck,
  Clock,
  MapPin,
  Phone,
  ArrowRight,
  Check,
} from "lucide-react";
import hero from "@/assets/ino-hero.jpg.asset.json";
import { SiteNav, SiteFooter } from "@/components/SiteNav";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/")({
  component: Index,
});

const services = [
  { icon: Home, name: "Home Cleaning", desc: "Deep and routine cleans that leave your home spotless." },
  { icon: Building2, name: "Office Cleaning", desc: "Keep workspaces fresh, hygienic and ready for business." },
  { icon: Store, name: "Shop Cleaning", desc: "Retail-ready spaces that welcome every customer." },
  { icon: Sofa, name: "Sofa & Carpet", desc: "Stain removal and refresh for upholstery and rugs." },
  { icon: Hammer, name: "Post-Construction", desc: "Paint, dust and POP residue — all gone." },
  { icon: PartyPopper, name: "After Event", desc: "We clean up so you can enjoy the memories." },
];

const perks = [
  { icon: ShieldCheck, title: "Trusted crew", desc: "Trained, uniformed and background-checked cleaners." },
  { icon: Sparkles, title: "Top-notch results", desc: "Professional-grade products and a keen eye for detail." },
  { icon: Clock, title: "Flexible bookings", desc: "Same-day or scheduled — you pick the time that works." },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {/* Hero */}
      <section className="relative overflow-hidden bg-background">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <div className="flex flex-col justify-center">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex w-fit items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-[color:var(--primary-deep)]"
            >
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              Your search is over.<br />
              <span className="text-[color:var(--primary)]">Top-notch cleaning</span>, delivered.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-5 max-w-lg text-base font-medium text-muted-foreground sm:text-lg"
            >
              Home, office, sofa, carpet or post-construction — we bring the sparkle. Book in minutes, we handle the rest.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link
                to="/book"
                className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5"
              >
                Book a cleaning
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="tel:+233530268611"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-[color:var(--muted)]"
              >
                <Phone className="h-4 w-4" /> 0530 268 611
              </a>
            </motion.div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm font-medium text-muted-foreground">
              {["Vetted crew", "Eco-friendly", "Satisfaction guaranteed"].map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[color:var(--primary)]" /> {t}
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="w-full h-full">
              <img src="/final.png" alt="Professional Ino cleaner ready to serve" className="h-full w-full object-contain" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--primary-deep)]">Our services</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything you need to keep spaces sparkling.
          </h2>
          <p className="mt-3 text-muted-foreground">
            From a quick tidy-up to a full post-construction reset, we tailor every visit to what your space needs.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.05}>
              <div className="group h-full rounded-md border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-[var(--shadow-card)]">
                <div className="grid h-11 w-11 place-items-center rounded-md bg-primary/10 text-[color:var(--primary-deep)] transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{s.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section id="why" className="border-y border-border bg-[color:var(--muted)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-3">
          {perks.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <div className="flex gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-background text-[color:var(--primary-deep)] shadow-sm border border-border">
                  <p.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--primary-deep)]">How it works</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Three steps to a spotless space.</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { n: "01", t: "Tell us about the space", d: "Pick a service and the rooms that need attention." },
            { n: "02", t: "Get an instant estimate", d: "Live pricing as you build your booking." },
            { n: "03", t: "We arrive & sparkle", d: "Our crew shows up on time, ready to work." },
          ].map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="rounded-md border border-border bg-card p-6">
                <div className="text-sm font-mono text-[color:var(--primary-deep)] font-bold">{s.n}</div>
                <h3 className="mt-2 text-lg font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-md bg-primary px-8 py-16 text-center">
            <h2 className="relative text-3xl font-semibold tracking-tight text-white sm:text-4xl">Ready for a fresh, spotless space?</h2>
            <p className="relative mx-auto mt-3 max-w-xl text-white/90">Build your booking in a couple of minutes and see the price as you go.</p>
            <div className="relative mt-8 flex flex-col items-center gap-4">
              <Link
                to="/book"
                className="inline-flex items-center gap-2 rounded-md bg-background px-6 py-3 text-sm font-medium text-foreground shadow-sm transition-transform hover:-translate-y-0.5"
              >
                Start booking <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="inline-flex items-center gap-2 text-sm text-white/90">
                <MapPin className="h-4 w-4" /> Serving Kumasi & KNUST area
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}
