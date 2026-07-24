import { Link } from "@tanstack/react-router";
import { Phone } from "lucide-react";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Ino Cleaning Services" className="h-12 w-auto" />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <a href="/#services" className="transition-colors hover:text-foreground">Services</a>
          <a href="/#why" className="transition-colors hover:text-foreground">Why Us</a>
          <a href="/#contact" className="transition-colors hover:text-foreground">Contact</a>
        </nav>
        <div className="flex items-center gap-5">
          <a href="tel:+233530268611" className="hidden items-center gap-2 text-sm font-medium hover:text-foreground md:flex">
            <Phone className="h-4 w-4" /> 0530 268 611
          </a>
          <Link
            to="/book"
            className="inline-flex items-center rounded-md border border-transparent bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:bg-transparent hover:border-primary hover:text-primary"
          >
            Book now
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-border/60 bg-[color:var(--muted)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <img src="/logo.png" alt="Ino Cleaning" className="h-10 w-auto" />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Top-notch cleaning services in Kumasi, around KNUST. Flexible bookings, sparkling results.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Kumasi, around KNUST</li>
            <li><a href="tel:+233530268611" className="hover:text-foreground">0530 268 611</a></li>
            <li><a href="https://tiktok.com/@ino.cleaningservices" className="hover:text-foreground">@ino.cleaningservices</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Hours</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Mon – Sat · 7:00 – 19:00</li>
            <li>Sunday · By appointment</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Ino Cleaning Services. All rights reserved.
      </div>
    </footer>
  );
}