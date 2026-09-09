const articles = [
  {
    tag: "The rule",
    title: "What the 20-20-20 rule actually asks of you",
    body: "Every 20 minutes, look at something 20 feet away for 20 seconds. It gives the focusing muscle inside your eye a chance to relax after long, fixed near-work.",
    minutes: 3,
  },
  {
    tag: "The science",
    title: "Why distance matters more than time",
    body: "Your ciliary muscle contracts to focus up close and releases to focus far. Six metres is roughly where it fully relaxes — closer than that and the break does less.",
    minutes: 4,
  },
  {
    tag: "Dry eyes",
    title: "Blink rate drops by half at a screen",
    body: "We blink around 15 times a minute normally, but only 5–7 while reading a screen. A look-away is also a reminder to blink fully and rewet the surface of the eye.",
    minutes: 2,
  },
  {
    tag: "Habits",
    title: "Making breaks stick past week one",
    body: "Pair the nudge with something you already do — stand, sip water, glance out a window. Anchoring the break to an existing habit is what turns it into a reflex.",
    minutes: 5,
  },
];

export default function Learn() {
  return (
    <div className="w-full px-6 py-10 md:px-6 md:py-14">

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
              Digital eye strain isn't damage — it's fatigue. The muscles that
              focus your vision hold tension when you work up close for hours.
              A short, far look-away every twenty minutes is the simplest way
              to release it.
            </p>
            <button className="mt-6 h-12 w-full rounded-2xl bg-[#101014] font-semi text-[15px] text-white transition-transform hover:scale-[1.02]">
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
          <article
            key={a.title}
            className="group flex flex-col rounded-[20px] bg-white p-6 transition-transform hover:-translate-y-0.5"
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
              {a.body}
            </p>
            <span className="mt-auto pt-5 flex items-center gap-1.5 font-semi text-[13px] text-[#0b4f8f]">
              Read
              <svg viewBox="0 0 24 24" className="size-4 transition-transform group-hover:translate-x-0.5" fill="none">
                <path d="M9.5 5.5L16.5 12L9.5 18.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </article>
        ))}
      </div>
    </div>
  );
}
