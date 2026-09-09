import { useEffect, useState } from "react";
import { articles, type Article } from "../content/articles";

function Reader({ article, onClose }: { article: Article; onClose: () => void }) {
  // Escape closes the reader, and the page behind it shouldn't scroll.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      <article
        role="dialog"
        aria-modal="true"
        aria-label={article.title}
        className="relative max-h-[92vh] w-full max-w-[720px] overflow-y-auto rounded-t-[28px] bg-white pb-[env(safe-area-inset-bottom)] sm:rounded-[28px]"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-white/95 px-7 pt-6 pb-4 backdrop-blur">
          <span className="font-bold-m text-[11px] uppercase tracking-[0.6px] text-[#4c7a46]">
            {article.tag} · {article.minutes} min
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid size-8 shrink-0 place-items-center rounded-full bg-[rgba(16,16,20,0.06)] text-[#101014] transition-colors hover:bg-[rgba(16,16,20,0.12)]"
          >
            <svg viewBox="0 0 14 14" className="size-3.5" fill="none">
              <path d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-7 pb-9">
          <h2 className="font-display text-[30px] leading-[1.14] tracking-[-0.5px] text-[#101014] sm:text-[36px]">
            {article.title}
          </h2>
          <p className="mt-4 font-semi text-[17px] leading-[27px] text-[rgba(16,16,20,0.72)]">
            {article.standfirst}
          </p>
          <div className="mt-7 space-y-5">
            {article.body.map((para, i) =>
              para.startsWith("## ") ? (
                <h3
                  key={i}
                  className="pt-2 font-bold-m text-[13px] uppercase tracking-[0.6px] text-[#0b4f8f]"
                >
                  {para.slice(3)}
                </h3>
              ) : (
                <p key={i} className="font-body text-[16px] leading-[27px] text-[rgba(16,16,20,0.82)]">
                  {para}
                </p>
              ),
            )}
          </div>
        </div>
      </article>
    </div>
  );
}

export default function Learn() {
  const [open, setOpen] = useState<Article | null>(null);

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-10 md:px-12 md:py-14">
      <h1 className="mb-6 font-bold-m text-[22px] text-white">Learn</h1>

      {/* Featured explainer */}
      <section className="overflow-hidden rounded-[24px] bg-white">
        <div className="grid gap-8 p-8 md:grid-cols-[1.2fr_1fr] md:items-center md:p-10">
          <div>
            <p className="font-bold-m text-[11px] uppercase tracking-[0.6px] text-[#4c7a46]">
              Eye health, in plain terms
            </p>
            <h2 className="mt-3 font-display text-[32px] leading-[1.1] tracking-[-0.5px] text-[#101014]">
              Your eyes weren't built to stare at one distance all day.
            </h2>
            <p className="mt-4 max-w-[46ch] font-body text-[16px] leading-[26px] text-[rgba(16,16,20,0.7)]">
              Digital eye strain isn't damage — it's fatigue. The muscles that focus
              your vision hold tension when you work up close for hours. A short, far
              look-away every twenty minutes is the simplest way to release it.
            </p>
            <button
              onClick={() => setOpen(articles[0])}
              className="mt-6 h-12 w-full rounded-2xl bg-[#101014] font-semi text-[15px] text-white transition-transform hover:scale-[1.02]"
            >
              Read the guide
            </button>
          </div>

          <div
            className="grid aspect-[4/3] place-items-center rounded-[20px] text-white"
            style={{ backgroundColor: "#1a3d2e" }}
          >
            <div className="text-center">
              <p className="font-mono-b text-[64px] leading-none tracking-[-3px]">20</p>
              <p className="mt-1 font-bold-m text-[11px] uppercase tracking-[0.6px]">
                seconds · 20 ft · 20 min
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Article grid */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {articles.map((a) => (
          <button
            key={a.id}
            onClick={() => setOpen(a)}
            className="group flex flex-col rounded-[20px] bg-white p-6 text-left transition-transform hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-lg bg-[#07325a] px-3 py-1.5 font-bold-m text-[11px] uppercase tracking-[0.6px] text-white">
                {a.tag}
              </span>
              <span className="font-mono-r text-[11px] uppercase tracking-[0.4px] text-[rgba(16,16,20,0.35)]">
                {a.minutes} min
              </span>
            </div>
            <h3 className="mt-4 font-bold-m text-[18px] leading-[24px] text-[#101014]">
              {a.title}
            </h3>
            <p className="mt-2 font-body text-[15px] leading-[23px] text-[rgba(16,16,20,0.65)]">
              {a.standfirst}
            </p>
            <span className="mt-auto flex items-center gap-1.5 pt-5 font-semi text-[13px] text-[#0b4f8f]">
              Read
              <svg
                viewBox="0 0 24 24"
                className="size-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
              >
                <path d="M9.5 5.5L16.5 12L9.5 18.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        ))}
      </div>

      {open && <Reader article={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
