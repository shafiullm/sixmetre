// Profile mark. Falls back to initials on the brand green so the app has no
// external image dependency and works offline.
export default function Avatar({
  src,
  name,
  className = "",
}: {
  src: string;
  name: string;
  className?: string;
}) {
  if (src.trim()) {
    return <img src={src} alt="" className={`object-cover ${className}`} />;
  }

  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();

  return (
    <span
      aria-hidden
      className={`grid place-items-center bg-[#8fb27a] font-bold-m text-[#06375f] ${className}`}
    >
      {initials || "?"}
    </span>
  );
}
