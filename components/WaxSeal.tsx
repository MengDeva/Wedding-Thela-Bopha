import { useId } from "react";

/** Build an irregular "melted wax" outline */
function blobPath(cx: number, cy: number, r: number, points = 26) {
  const pts: [number, number][] = [];
  for (let i = 0; i < points; i++) {
    const a = (i / points) * Math.PI * 2;
    const wobble = 1 + 0.055 * Math.sin(i * 2.7) + 0.035 * Math.cos(i * 5.3) + 0.025 * Math.sin(i * 11.1);
    pts.push([cx + Math.cos(a) * r * wobble, cy + Math.sin(a) * r * wobble]);
  }
  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)} `;
  for (let i = 0; i < points; i++) {
    const p1 = pts[(i + 1) % points];
    const p0 = pts[i];
    const mx = (p0[0] + p1[0]) / 2;
    const my = (p0[1] + p1[1]) / 2;
    d += `Q ${p0[0].toFixed(2)} ${p0[1].toFixed(2)} ${mx.toFixed(2)} ${my.toFixed(2)} `;
  }
  return d + "Z";
}

const OUTER = blobPath(50, 50, 46);

export default function WaxSeal({ text, className = "" }: { text: string; className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <span className={`seal ${className}`} aria-hidden="true">
      <svg viewBox="0 0 100 100">
        <defs>
          <radialGradient id={`wax-${id}`} cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="var(--seal)" stopOpacity="1" />
            <stop offset="55%" stopColor="var(--seal)" />
            <stop offset="100%" stopColor="var(--seal-dark)" />
          </radialGradient>
          <radialGradient id={`shine-${id}`} cx="35%" cy="28%" r="40%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d={OUTER} fill={`url(#wax-${id})`} />
        {/* pressed inner ring */}
        <circle cx="50" cy="50" r="33" fill="var(--seal-dark)" opacity="0.35" />
        <circle cx="50" cy="50" r="31.5" fill={`url(#wax-${id})`} />
        <circle cx="50" cy="50" r="28" fill="none" stroke="rgba(255,235,210,0.35)" strokeWidth="0.8" strokeDasharray="1.5 2" />
        {/* tiny leaf ornaments */}
        <g fill="rgba(255,235,210,0.4)">
          <path d="M50 22 q3 3 0 6 q-3 -3 0 -6z" />
          <path d="M50 72 q3 3 0 6 q-3 -3 0 -6z" />
        </g>
        <path d={OUTER} fill={`url(#shine-${id})`} />
      </svg>
      <span className="seal-text">
        {text}
      </span>
    </span>
  );
}
