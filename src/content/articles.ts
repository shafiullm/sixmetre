// Learn content. Plain, checkable claims — no miracle cures.

export type Article = {
  id: string;
  tag: string;
  title: string;
  standfirst: string;
  minutes: number;
  /** Body paragraphs; a string starting with "## " renders as a subheading. */
  body: string[];
};

export const articles: Article[] = [
  {
    id: "the-rule",
    tag: "The rule",
    title: "What the 20-20-20 rule actually asks of you",
    standfirst:
      "Every 20 minutes, look at something 20 feet away for 20 seconds. It gives the focusing muscle inside your eye a chance to relax after long, fixed near-work.",
    minutes: 3,
    body: [
      "The rule is usually credited to Californian optometrist Jeffrey Anshel, who proposed it as a memorable rounding of advice that was already circulating: interrupt sustained near-work, often, and look far away when you do.",
      "The numbers are mnemonic rather than clinical. Nothing dramatic happens at nineteen feet or at twenty-one seconds. What matters is the shape of the habit — short, frequent, and genuinely distant.",
      "## Why twenty feet",
      "Twenty feet is roughly six metres, which is where the eye's focusing effort has dropped close to zero. Optometrists call this optical infinity: past about six metres, light arriving at your eye is near enough to parallel that focusing further away asks nothing more of the muscle.",
      "That is the whole reason the distance is specified. A break spent looking at the far side of your desk is not much of a break — your eye is still holding almost the same focus it held while you worked.",
      "## Why twenty seconds",
      "The ciliary muscle does not release instantly. Twenty seconds is a practical estimate of how long it takes to unwind after a long stretch of close focus, with a margin for the fact that most people glance away and straight back.",
      "## What it does not do",
      "Screen work does not damage your eyes, and the 20-20-20 rule is not a treatment for anything. It targets the fatigue — the ache, the blur at the end of the day, the dryness — that comes from holding one focus and blinking too little. If your symptoms persist regardless, that is a reason to see an optometrist, not to look further away.",
    ],
  },
  {
    id: "distance",
    tag: "The science",
    title: "Why distance matters more than time",
    standfirst:
      "Your ciliary muscle contracts to focus up close and releases to focus far. Six metres is roughly where it fully relaxes — closer than that and the break does less.",
    minutes: 4,
    body: [
      "Focusing on something near is active work. A ring of muscle inside the eye — the ciliary muscle — contracts, which lets the lens thicken and bend light more sharply. This is accommodation, and holding it is the eye equivalent of holding a light weight at arm's length.",
      "Release the muscle and the lens flattens, and the eye settles at its resting focus, far away. That release is what a look-away is for.",
      "## The accommodation curve",
      "The effort involved falls off sharply with distance. Focusing at 25 cm takes about four dioptres of accommodation; at one metre, one dioptre; at six metres, roughly a sixth of one. Practically, the difference between six metres and the horizon is negligible, while the difference between 50 cm and six metres is nearly everything.",
      "This is why the distance is the part of the rule worth being strict about. Twenty seconds spent looking at a wall two metres away is not worthless, but it is a fraction of the release you would get from a window.",
      "## Finding six metres indoors",
      "Most rooms are smaller than you would like. The far corner of an open-plan floor usually works. A window is better — anything outside it is effectively at infinity, whatever the glass is between you and it. A corridor works. In a small room, the honest answer is to stand up and look out of the door.",
    ],
  },
  {
    id: "blinking",
    tag: "Dry eyes",
    title: "Blink rate drops by half at a screen",
    standfirst:
      "We blink around 15 times a minute normally, but far less while reading a screen. A look-away is also a reminder to blink fully and rewet the surface of the eye.",
    minutes: 2,
    body: [
      "Concentration suppresses blinking. Studies of screen work have repeatedly found blink rates falling to somewhere between a third and two thirds of the resting rate, and — just as importantly — a rise in incomplete blinks, where the lid never quite closes.",
      "Each full blink resurfaces the eye with tear film. Skip them and the film thins and breaks up in patches, which is what the grit-and-sting feeling at four in the afternoon actually is.",
      "## Make the break do double duty",
      "While you are looking away, blink deliberately — several slow, complete blinks, letting the lids meet properly each time. It takes two seconds of the twenty and addresses a different mechanism entirely from the focusing one.",
      "## The other levers",
      "A screen placed slightly below eye level means your lids sit lower and less of the eye's surface is exposed. Dry air makes everything worse, so air conditioning and forced-air heating are worth noticing. If your eyes are persistently dry rather than just tired at the end of the day, that is worth raising with an optometrist.",
    ],
  },
  {
    id: "habit",
    tag: "Habits",
    title: "Making breaks stick past week one",
    standfirst:
      "Pair the nudge with something you already do — stand, sip water, glance out a window. Anchoring the break to an existing habit is what turns it into a reflex.",
    minutes: 5,
    body: [
      "The failure mode of every break reminder is the same: it fires during the one paragraph you did not want interrupted, you dismiss it, and by the end of the week you are dismissing it reflexively.",
      "## Make the nudge match the work",
      "If you are in and out of meetings, a full-screen break is going to lose. Use the banner, and let the app record what you actually did rather than what you meant to do — a missed break in the log is information, not a scolding.",
      "## Anchor it to something physical",
      "The look-away is more likely to survive if it rides along with a movement you would make anyway: standing, reaching for water, turning towards a window. The physical action is the cue; the twenty seconds comes free.",
      "## Read your own log",
      "Most people have one bad hour, usually mid-afternoon. Once you can see it in the Log, it stops being a character flaw and becomes a scheduling problem — that is the hour to put a walk in, not another block of close work.",
      "## Do not chase a perfect score",
      "Keeping three breaks in four is a genuinely good week. Aiming for every single one turns a small ergonomic habit into another thing to fail at, and that is how people quit.",
    ],
  },
];
