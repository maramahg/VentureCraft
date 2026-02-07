"use client";

import React, { useMemo, useState } from "react";

type Status = "idle" | "success";
type Errors = Record<string, string>;

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// Light “VC-inspired” palette (works even without Tailwind config changes)
const styles = {
  pageBg:
    "min-h-screen px-4 py-10 text-white " +
    "bg-[radial-gradient(900px_500px_at_20%_10%,rgba(39,186,169,.25),transparent_60%)," +
    "radial-gradient(900px_500px_at_80%_20%,rgba(33,67,141,.20),transparent_60%)," +
    "radial-gradient(900px_500px_at_50%_85%,rgba(33,113,97,.18),transparent_60%)," +
    "linear-gradient(to_bottom,#020c12,#020c12)]",
  card:
    "rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur sm:p-8",
  pill:
    "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur",
  input:
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/35 outline-none " +
    "focus:border-white/20 focus:ring-2 focus:ring-[rgba(39,186,169,.35)]",
  button:
    "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium " +
    "border border-white/10 bg-white/10 text-white backdrop-blur hover:bg-white/15 active:scale-[.99] transition " +
    "focus:outline-none focus:ring-2 focus:ring-[rgba(39,186,169,.45)]",
  help: "mt-1 text-xs text-white/45",
  err: "mt-1 text-xs text-red-200",
};

export default function ApplyPage() {
  const themeOptions = useMemo(
    () => [
      "Sustainable Energy",
      "Climate Tech",
      "Materials / Chemistry",
      "AI / Data",
      "Robotics / Hardware",
      "Biotech / Health",
      "Other",
    ],
    []
  );

  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [payload, setPayload] = useState<object | null>(null);

  function validate(fd: FormData) {
    const next: Errors = {};
    const required = ["fullName", "email", "ideaTitle", "summary"];
    for (const key of required) {
      const v = String(fd.get(key) ?? "").trim();
      if (!v) next[key] = "Required";
    }

    const email = String(fd.get("email") ?? "").trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email";

    const summary = String(fd.get("summary") ?? "").trim();
    if (summary && summary.length < 50) next.summary = "Please provide at least 50 characters";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    if (!validate(fd)) return;

    // Frontend-only "submission": build a JSON object and show it
    const obj = Object.fromEntries(fd.entries());
    setPayload(obj);
    setStatus("success");
  }

  return (
    <main className={styles.pageBg}>
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-8">
          <div className={styles.pill}>KFUPM Venture Craft • Application Form</div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Submit your idea
          </h1>
          <p className="mt-2 max-w-2xl text-white/70">
            Frontend-only form (no backend). After you send the exact field list, I’ll reshape this
            to match it 1:1.
          </p>
        </header>

        <section className={styles.card}>
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Contact */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full name" name="fullName" placeholder="e.g., Sara Alqahtani" error={errors.fullName} />
              <Field label="Email" name="email" type="email" placeholder="name@university.edu" error={errors.email} />
              <Field label="Phone (optional)" name="phone" placeholder="+966 ..." />
              <Field label="University / Organization (optional)" name="org" placeholder="KFUPM, ..." />
            </div>

            {/* Venture */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Team name (optional)" name="teamName" placeholder="Your venture/team" />
              <Field label="Role (optional)" name="role" placeholder="Founder, CTO, ..." />
            </div>

            {/* Idea */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Idea title" name="ideaTitle" placeholder="Short, memorable title" error={errors.ideaTitle} />
              <Select label="Theme" name="theme" options={themeOptions} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Select label="Stage" name="stage" options={["Concept", "Prototype", "MVP", "Early traction", "Revenue"]} />
              <Select label="Sector" name="sector" options={["Energy", "Industrial", "Health", "Mobility", "Agritech", "Other"]} />
              <Select label="Team size" name="teamSize" options={["1", "2-3", "4-6", "7+"]} />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/80">Idea summary</label>
              <textarea
                name="summary"
                rows={6}
                className={cx(styles.input, errors.summary && "border-red-400/40 ring-2 ring-red-400/20")}
                placeholder="What problem are you solving, how does it work, and why now?"
              />
              {errors.summary && <p className={styles.err}>{errors.summary}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/80">Pitch deck link (optional)</label>
              <input name="deckUrl" className={styles.input} placeholder="Google Drive / Dropbox / website link" />
              <p className={styles.help}>Use a shareable link (view access).</p>
            </div>

            <label className="flex items-start gap-3 text-sm text-white/70">
              <input
                name="consent"
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-white/20 bg-white/10 accent-[rgba(39,186,169,1)]"
                required
              />
              <span>I confirm this submission is accurate and I agree to be contacted about the competition.</span>
            </label>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button type="submit" className={styles.button}>
                Submit (frontend-only)
              </button>

              {status === "success" && (
                <span className="text-sm text-emerald-100/90">
                  Submitted locally ✅ (see preview below)
                </span>
              )}
            </div>
          </form>
        </section>

        {/* Preview payload (optional, helpful for frontend-only) */}
        {payload && (
          <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="mb-2 text-sm text-white/70">Submission preview (JSON)</div>
            <pre className="overflow-auto rounded-xl border border-white/10 bg-black/30 p-4 text-xs text-white/80">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </section>
        )}

        <p className="mt-6 text-xs text-white/50">
          Replace the fields above with your official form details when you send them.
        </p>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
  error,
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-white/80">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className={cx(styles.input, error && "border-red-400/40 ring-2 ring-red-400/20")}
      />
      {error && <p className={styles.err}>{error}</p>}
    </div>
  );
}

function Select({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-white/80">{label}</label>
      <select name={name} className={cx(styles.input, "appearance-none")}>
        {options.map((o) => (
          <option key={o} value={o} className="bg-[#072a3b]">
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
