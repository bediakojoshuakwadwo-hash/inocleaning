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
  Download,
  Store,
  Warehouse,
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
  { id: "deep", label: "Deep Cleaning (Residential)", icon: Sparkles },
  { id: "post", label: "Post Construction (Residential)", icon: Hammer },
  { id: "in", label: "Move In Cleaning (Residential)", icon: PackageOpen },
  { id: "out", label: "Move Out Cleaning (Residential)", icon: Truck },
  { id: "renovated", label: "Renovated House (Residential)", icon: Wrench },
  { id: "living", label: "Living In Cleaning (Residential)", icon: Home },
  { id: "shop_post", label: "Post Construction (Shop)", icon: Store },
  { id: "warehouse", label: "Warehouse Cleaning", icon: Warehouse },
];

const ROOMS = [
  { id: "bedroom", label: "Bedroom", price: 170 },
  { id: "hall", label: "Hall", price: 250 },
  { id: "kitchen", label: "Kitchen", price: 250 },
  { id: "washroom", label: "Washroom", price: 170 },
  { id: "garage", label: "Garage", price: 150 },
  { id: "balcony", label: "Balcony / Veranda", price: 150 },
  { id: "store", label: "Store", price: 200 },
  { id: "study", label: "Study", price: 200 },
  { id: "dining", label: "Dining", price: 170 },
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

const FRIDGES = [
  { id: "f_sm", label: "Small Fridge", price: 200 },
  { id: "f_md", label: "Medium Fridge", price: 250 },
  { id: "f_lg", label: "Large Fridge", price: 300 },
];

const CONDITIONS = [
  { id: "paint", label: "Paint or POP residue", price: 250 },
  { id: "stains", label: "Tough stains", price: 200 },
  { id: "popdirty", label: "POP residue + very dirty", price: 400 },
  { id: "heavy", label: "Moving of heavy furniture and equipment", price: 300 },
];

function fmt(n: number) {
  return `GH₵${n.toLocaleString()}`;
}

function BookPage() {
  const [job, setJob] = useState<string | null>(null);
  const [shopCount, setShopCount] = useState(1);
  const [warehouseCount, setWarehouseCount] = useState(1);
  const [rooms, setRooms] = useState<Record<string, number>>({});
  const [sofas, setSofas] = useState<Record<string, number>>({});
  const [carpets, setCarpets] = useState<Record<string, number>>({});
  const [conds, setConds] = useState<Record<string, boolean>>({});
  const [windows, setWindows] = useState(0);
  const [utensils, setUtensils] = useState(false);
  const [folding, setFolding] = useState(false);
  const [fridges, setFridges] = useState<Record<string, number>>({});
  const [contact, setContact] = useState({ name: "", phone: "", location: "", date: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  const bump = (
    setter: React.Dispatch<React.SetStateAction<Record<string, number>>>,
    id: string,
    delta: number,
  ) => setter((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] ?? 0) + delta) }));

  const isPremiumJob = job === "post" || job === "renovated";
  const priceOffset = isPremiumJob ? 50 : 0;

  const totalRaw = useMemo(() => {
    let t = 0;
    if (job === "shop_post") {
      t += Math.max(1, shopCount) * 1600;
    } else if (job === "warehouse") {
      t += Math.max(1, warehouseCount) * 8000;
    } else {
      for (const r of ROOMS) t += (rooms[r.id] ?? 0) * (r.price + priceOffset);
      for (const s of SOFAS) t += (sofas[s.id] ?? 0) * (s.price + priceOffset);
      for (const c of CARPETS) t += (carpets[c.id] ?? 0) * (c.price + priceOffset);
      t += windows * (50 + priceOffset);
      if (utensils) t += (250 + priceOffset);
      for (const f of FRIDGES) t += (fridges[f.id] ?? 0) * (f.price + priceOffset);
    }
    
    for (const c of CONDITIONS) if (conds[c.id]) t += (c.price + priceOffset);
    
    return t;
  }, [job, shopCount, warehouseCount, rooms, sofas, carpets, conds, windows, utensils, fridges, priceOffset]);

  const discount = totalRaw > 1500 ? totalRaw * 0.02 : 0;
  const total = totalRaw - discount;

  const isPhoneInvalid = contact.phone.length > 0 && (contact.phone.length < 10 || !contact.phone.startsWith("0"));
  const canSubmit = job && total > 0 && contact.name && contact.phone.length === 10 && contact.phone.startsWith("0") && contact.location;

  async function generateInvoice() {
    const { jsPDF } = await import("jspdf");
    const autoTableModule = await import("jspdf-autotable");
    const autoTable = autoTableModule.default || autoTableModule.autoTable;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    let textStartY = 22;
    try {
      const img = new Image();
      img.src = '/logo.png';
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      const imgWidth = 40;
      const imgHeight = (img.height / img.width) * imgWidth;
      const xPos = (pageWidth - imgWidth) / 2;
      doc.addImage(img, 'PNG', xPos, 15, imgWidth, imgHeight);
      textStartY = 15 + imgHeight + 10;
    } catch (e) {
      console.error("Failed to load logo", e);
    }

    doc.setFontSize(22);
    doc.setTextColor(116, 184, 187);
    doc.text("Ino Cleaning Services", pageWidth / 2, textStartY, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Invoice / Booking Request", pageWidth / 2, textStartY + 8, { align: "center" });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth / 2, textStartY + 14, { align: "center" });

    let currentY = textStartY + 30;
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Customer Details:", 14, currentY);
    
    currentY += 6;
    doc.setFontSize(10);
    doc.text(`Name: ${contact.name}`, 14, currentY); currentY += 6;
    doc.text(`Phone: ${contact.phone}`, 14, currentY); currentY += 6;
    doc.text(`Location: ${contact.location}`, 14, currentY); currentY += 6;
    doc.text(`Preferred Date: ${contact.date || "Not specified"}`, 14, currentY); currentY += 12;

    const jobLabel = JOB_TYPES.find((j) => j.id === job)?.label ?? "—";
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Service Type: ${jobLabel}`, 14, currentY);
    currentY += 8;

    const tableData: [string, string, string, string][] = [];
    const pdfFmt = (n: number) => `GHS ${n.toLocaleString()}`;

    if (job === "shop_post") {
      tableData.push(["Shop Postconstruction", "-", String(shopCount), pdfFmt(1600)]);
    } else if (job === "warehouse") {
      tableData.push(["Warehouse Cleaning", "-", String(warehouseCount), pdfFmt(8000)]);
    } else {
      for (const r of ROOMS) {
        if (rooms[r.id]) tableData.push([r.label, "-", String(rooms[r.id]), pdfFmt(r.price + priceOffset)]);
      }
      for (const s of SOFAS) {
        if (sofas[s.id]) tableData.push([s.label + " Sofa", "-", String(sofas[s.id]), pdfFmt(s.price + priceOffset)]);
      }
      for (const c of CARPETS) {
        if (carpets[c.id]) tableData.push([c.label + " Carpet", "-", String(carpets[c.id]), pdfFmt(c.price + priceOffset)]);
      }
      if (windows > 0) {
        tableData.push(["Windows", "-", String(windows), pdfFmt(50 + priceOffset)]);
      }
      if (utensils) {
        tableData.push(["Utensils", "-", "-", pdfFmt(250 + priceOffset)]);
      }
      for (const f of FRIDGES) {
        if (fridges[f.id]) {
          tableData.push([f.label, "-", String(fridges[f.id]), pdfFmt(f.price + priceOffset)]);
        }
      }
      if (folding) {
        tableData.push(["Folding of clothes", "-", "-", "Upon inspection"]);
      }
    }

    for (const c of CONDITIONS) {
      if (conds[c.id]) tableData.push([c.label, "Condition", "-", pdfFmt(c.price + priceOffset)]);
    }

    if (discount > 0) {
      tableData.push(["Discount (2% on > 1500)", "-", "-", `-${pdfFmt(discount)}`]);
    }

    autoTable(doc, {
      startY: currentY,
      head: [["Item", "Details", "Qty", "Unit Price"]],
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: [116, 184, 187] },
    });

    const finalY = (doc as any).lastAutoTable.finalY || currentY;
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(`Estimated Total: ${pdfFmt(total)}`, 14, finalY + 15);

    if (contact.notes) {
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("Notes:", 14, finalY + 25);
      const splitNotes = doc.splitTextToSize(contact.notes, pageWidth - 28);
      doc.text(splitNotes, 14, finalY + 31);
    }

    doc.save(`Ino_Cleaning_Invoice_${contact.name.replace(/\s+/g, "_")}.pdf`);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitted(true);
    await generateInvoice();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <section className="border-b border-border bg-[color:var(--muted)]">
        <div className="bg-primary/10 px-4 py-3 text-center text-sm font-medium text-[color:var(--primary-deep)]">
          🎉 Special Offer: Any bill beyond GH₵1,500 gets an automatic 2% discount!
        </div>
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
            <h2 className="mt-6 text-3xl font-semibold tracking-tight">Booking ready for confirmation!</h2>
            <p className="mt-3 text-muted-foreground">
              Thanks {contact.name.split(" ")[0]}! Your invoice has been downloaded.
            </p>

            <div className="mt-8 rounded-lg border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <h3 className="text-lg font-medium text-foreground">Next Step: Finalize & Pay</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                To begin work, please send us the generated invoice on WhatsApp. We will provide you with the payment details. Once you make the payment and submit the receipt, your booking is confirmed!
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <a
                  href={`https://wa.me/233530268611?text=${encodeURIComponent("Hello, I would like to confirm my booking and process payment. My invoice is attached.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-6 py-3 text-sm font-medium text-white shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                  Send on WhatsApp
                </a>
                <button
                  type="button"
                  onClick={generateInvoice}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <Download className="h-4 w-4" />
                  Download Invoice Again
                </button>
              </div>
            </div>

            <div className="mt-8 inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm shadow-[var(--shadow-soft)]">
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

              {job === "shop_post" && (
                <Step number="2" title="Quantity">
                  <div className="rounded-md border border-border bg-card">
                    <Counter
                      label="Number of Shops"
                      sub={`${fmt(1600)} each`}
                      value={shopCount}
                      onChange={(d) => setShopCount((v) => Math.max(1, v + d))}
                    />
                  </div>
                </Step>
              )}

              {job === "warehouse" && (
                <Step number="2" title="Quantity">
                  <div className="rounded-md border border-border bg-card">
                    <Counter
                      label="Number of Warehouses"
                      sub={`${fmt(8000)} each`}
                      value={warehouseCount}
                      onChange={(d) => setWarehouseCount((v) => Math.max(1, v + d))}
                    />
                  </div>
                </Step>
              )}

              {job && job !== "shop_post" && job !== "warehouse" && (
                <>
                  <Step number="2" title="Rooms">
                    <div className="divide-y divide-border rounded-md border border-border bg-card">
                      {ROOMS.map((r) => (
                        <Counter
                          key={r.id}
                          label={r.label}
                          sub={`${fmt(r.price + priceOffset)} each`}
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
                          price={fmt(s.price + priceOffset)}
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
                          price={`${fmt(c.price + priceOffset)} each`}
                          value={carpets[c.id] ?? 0}
                          onChange={(d) => bump(setCarpets, c.id, d)}
                        />
                      ))}
                    </div>
                  </Step>

                  <Step number="5" title="Windows">
                    <div className="rounded-md border border-border bg-card">
                      <Counter
                        label="Windows"
                        sub={`${fmt(50 + priceOffset)} per window`}
                        value={windows}
                        onChange={(d) => setWindows((v) => Math.max(0, v + d))}
                      />
                    </div>
                  </Step>

                  <Step number="6" title="Others">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="col-span-1 sm:col-span-2 grid gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => setUtensils((p) => !p)}
                          className={`flex items-center justify-between rounded-md border p-4 text-left transition-all ${
                            utensils ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"
                          }`}
                        >
                          <div>
                            <div className="text-sm font-medium">Utensils</div>
                            <div className="text-xs text-muted-foreground">+{fmt(250 + priceOffset)}</div>
                          </div>
                          <span className={`grid h-6 w-6 place-items-center rounded-md border ${utensils ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                            {utensils && <Check className="h-3.5 w-3.5" />}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setFolding((p) => !p)}
                          className={`flex items-center justify-between rounded-md border p-4 text-left transition-all ${
                            folding ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"
                          }`}
                        >
                          <div>
                            <div className="text-sm font-medium">Folding of clothes</div>
                            <div className="text-xs text-muted-foreground">Price: Upon inspection</div>
                          </div>
                          <span className={`grid h-6 w-6 place-items-center rounded-md border ${folding ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                            {folding && <Check className="h-3.5 w-3.5" />}
                          </span>
                        </button>
                      </div>

                      <div className="col-span-1 sm:col-span-2 divide-y divide-border rounded-md border border-border bg-card">
                        {FRIDGES.map((f) => (
                          <Counter
                            key={f.id}
                            label={f.label}
                            sub={`${fmt(f.price + priceOffset)} each`}
                            value={fridges[f.id] ?? 0}
                            onChange={(d) => bump(setFridges, f.id, d)}
                          />
                        ))}
                      </div>
                    </div>
                  </Step>
                </>
              )}

              {job && (
                <Step number={job === "shop_post" || job === "warehouse" ? "3" : "7"} title="Special conditions">
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
                            <div className="text-xs text-muted-foreground">+{fmt(c.price + priceOffset)}</div>
                          </div>
                          <span className={`grid h-6 w-6 place-items-center rounded-md border ${active ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                            {active && <Check className="h-3.5 w-3.5" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </Step>
              )}

              <Step number={!job ? "2" : job === "shop_post" || job === "warehouse" ? "4" : "8"} title="Your details">
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
                  <Field label="Phone (Begins with 0)" required>
                    <input
                      required
                      maxLength={10}
                      value={contact.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        if (val.length > 0 && val[0] !== "0") return;
                        setContact({ ...contact, phone: val });
                      }}
                      className={`input ${isPhoneInvalid ? "error" : ""}`}
                      placeholder="0530268611"
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
                  {job === "shop_post" ? (
                    <SummaryLine label="Shops" value={String(Math.max(1, shopCount))} />
                  ) : job === "warehouse" ? (
                    <SummaryLine label="Warehouses" value={String(Math.max(1, warehouseCount))} />
                  ) : (
                    <>
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
                      {utensils && <SummaryLine label="Utensils" value="Yes" />}
                      {Object.values(fridges).reduce((a, b) => a + b, 0) > 0 && (
                        <SummaryLine
                          label="Fridges"
                          value={String(Object.values(fridges).reduce((a, b) => a + b, 0))}
                        />
                      )}
                      {folding && <SummaryLine label="Folding clothes" value="Yes" />}
                    </>
                  )}
                  {discount > 0 && (
                    <div className="mt-2 border-t border-border pt-2">
                      <SummaryLine label="Discount (2%)" value={`-${fmt(discount)}`} />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md border border-transparent bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:bg-transparent hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:-translate-y-0 disabled:hover:border-transparent disabled:hover:bg-primary disabled:hover:text-primary-foreground"
                >
                  Request booking <ArrowRight className="h-4 w-4 transition-transform group-hover:animate-fly" />
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
        .input.error {
          border-color: #ef4444;
        }
        .input.error:focus {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px color-mix(in oklab, #ef4444 20%, transparent);
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