import React from "react";

const NAVY = "#0F1C2E";
const TEAL = "#00C49F";
const WHITE = "white";

function GateMark({
  tileColor = NAVY,
  gateColor = WHITE,
  arrowColor = TEAL,
  tileOpacity = 1,
}: {
  tileColor?: string;
  gateColor?: string;
  arrowColor?: string;
  tileOpacity?: number;
}) {
  return (
    <>
      {/* Tile background */}
      <rect x="0" y="0" width="80" height="80" rx="15" fill={tileColor} fillOpacity={tileOpacity} />
      {/* Gate — left post */}
      <rect x="10" y="8" width="12" height="50" fill={gateColor} />
      {/* Gate — right post */}
      <rect x="58" y="8" width="12" height="50" fill={gateColor} />
      {/* Gate — lintel */}
      <rect x="10" y="8" width="60" height="12" fill={gateColor} />
      {/* Arrow in gate opening — right-pointing triangle */}
      {/* Opening: x 22–58, y 20–58 */}
      <polygon points="24,22 24,56 56,39" fill={arrowColor} />
    </>
  );
}

function LogoHorizontal({
  dark = false,
  scale = 1,
}: {
  dark?: boolean;
  scale?: number;
}) {
  const textColor = dark ? WHITE : NAVY;
  const w = 296;
  const h = 100;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w * scale}
      height={h * scale}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(10 10)">
        <GateMark
          tileColor={dark ? "rgba(255,255,255,0.1)" : NAVY}
          gateColor={WHITE}
          arrowColor={TEAL}
        />
      </g>
      <text
        fontFamily="'DM Sans', sans-serif"
        fontSize="40"
        x="108"
        y="66"
        letterSpacing="-0.5"
      >
        <tspan fill={textColor} fontWeight="300">Let</tspan>
        <tspan fill={textColor} fontWeight="700">logic</tspan>
      </text>
    </svg>
  );
}

function LogoStacked({ scale = 1 }: { scale?: number }) {
  const w = 160;
  const h = 136;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w * scale}
      height={h * scale}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(40 0)">
        <GateMark />
      </g>
      <text
        fontFamily="'DM Sans', sans-serif"
        fontSize="26"
        textAnchor="middle"
        x="80"
        y="124"
        letterSpacing="-0.3"
      >
        <tspan fill={NAVY} fontWeight="300">Let</tspan>
        <tspan fill={NAVY} fontWeight="700">logic</tspan>
      </text>
    </svg>
  );
}

function IconOnly({ size = 80 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 80 80"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <GateMark />
    </svg>
  );
}

function Divider() {
  return <div className="w-full h-px bg-black/8" />;
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs tracking-widest uppercase"
      style={{ fontFamily: "'DM Sans', sans-serif", color: "#9AA0AC", fontWeight: 500 }}
    >
      {children}
    </p>
  );
}

export default function App() {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center gap-0"
      style={{ background: "#EFF1F5", fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="w-full max-w-3xl flex flex-col">
        {/* Primary horizontal lockup */}
        <div className="flex flex-col items-start gap-5 px-14 py-14">
          <Label>Primary lockup</Label>
          <LogoHorizontal scale={1.4} />
        </div>

        <Divider />

        {/* Dark background version */}
        <div
          className="flex flex-col items-start gap-5 px-14 py-14"
          style={{ background: NAVY }}
        >
          <Label>On dark</Label>
          <LogoHorizontal dark scale={1.2} />
        </div>

        <Divider />

        {/* Compact variants */}
        <div className="flex flex-row items-start gap-16 px-14 py-14">
          <div className="flex flex-col items-start gap-5">
            <Label>Stacked</Label>
            <LogoStacked scale={1.3} />
          </div>

          <div className="flex flex-col items-start gap-5">
            <Label>Icon — 80px</Label>
            <IconOnly size={80} />
          </div>

          <div className="flex flex-col items-start gap-5">
            <Label>Icon — 32px</Label>
            <IconOnly size={32} />
          </div>

          <div className="flex flex-col items-start gap-5">
            <Label>Icon — 16px</Label>
            <IconOnly size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}
