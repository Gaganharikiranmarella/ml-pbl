import { useMemo, useState } from "react";
import { MethodContent } from "@/types/method";

interface Props {
  method: MethodContent;
}

type Point = {
  x: number;
  y: number;
};

const width = 760;
const height = 420;
const padding = { top: 28, right: 56, bottom: 48, left: 60 };

const createScale = (domainMin: number, domainMax: number, rangeMin: number, rangeMax: number) => {
  const span = domainMax - domainMin || 1;
  return (value: number) => rangeMin + ((value - domainMin) / span) * (rangeMax - rangeMin);
};

const buildLinePath = (points: Point[]) =>
  points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

export default function Graph({ method }: Props) {
  const [timeScale, setTimeScale] = useState(1);
  const [spaceScale, setSpaceScale] = useState(1);

  const points = useMemo(
    () =>
      method.complexity.map((p) => ({
        ...p,
        time: p.time * timeScale,
        space: p.space * spaceScale,
      })),
    [method.complexity, timeScale, spaceScale],
  );

  const x = points.map((p) => p.n);

  const xMin = Math.min(...x);
  const xMax = Math.max(...x);
  const yValues = points.flatMap((p) => [p.time, p.space]);
  const yMin = 0;
  const yMax = Math.max(...yValues) * 1.1;

  const xScale = createScale(xMin, xMax, padding.left, width - padding.right);
  const yScale = createScale(yMin, yMax, height - padding.bottom, padding.top);

  const timePoints = points.map((point) => ({ x: xScale(point.n), y: yScale(point.time) }));
  const spacePoints = points.map((point) => ({ x: xScale(point.n), y: yScale(point.space) }));

  const yTicks = Array.from({ length: 5 }, (_, index) => (yMax / 4) * index);
  const xTicks = x;

  return (
    <section className="rounded-2xl border border-slate-300/40 bg-white/60 p-4 shadow-halo backdrop-blur dark:border-slate-200/10 dark:bg-slate-900/40">
      <div className="mb-3 grid gap-3 md:grid-cols-2">
        <label className="text-sm">
          <div className="mb-1 font-medium">Time Weight: {timeScale.toFixed(2)}x</div>
          <input
            type="range"
            min={0.5}
            max={2}
            step={0.05}
            value={timeScale}
            onChange={(e) => setTimeScale(Number(e.target.value))}
            className="w-full"
          />
        </label>
        <label className="text-sm">
          <div className="mb-1 font-medium">Space Weight: {spaceScale.toFixed(2)}x</div>
          <input
            type="range"
            min={0.5}
            max={2}
            step={0.05}
            value={spaceScale}
            onChange={(e) => setSpaceScale(Number(e.target.value))}
            className="w-full"
          />
        </label>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/40 bg-slate-950/90 p-3 text-slate-100 shadow-inner dark:border-slate-200/10">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-[420px] w-full">
          {yTicks.map((tick) => {
            const y = yScale(tick);
            return (
              <g key={tick}>
                <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="rgba(255,255,255,0.08)" />
                <text x={padding.left - 12} y={y + 4} textAnchor="end" className="fill-slate-300 text-[10px]">
                  {tick.toFixed(0)}
                </text>
              </g>
            );
          })}

          {xTicks.map((tick, index) => {
            const xPos = xScale(tick);
            return (
              <g key={tick}>
                <line x1={xPos} x2={xPos} y1={padding.top} y2={height - padding.bottom} stroke="rgba(255,255,255,0.05)" />
                <text x={xPos} y={height - 22} textAnchor="middle" className="fill-slate-300 text-[10px]">
                  {index === 0 || index === xTicks.length - 1 || index % 2 === 0 ? tick : ""}
                </text>
              </g>
            );
          })}

          <line x1={padding.left} x2={width - padding.right} y1={height - padding.bottom} y2={height - padding.bottom} stroke="rgba(255,255,255,0.45)" />
          <line x1={padding.left} x2={padding.left} y1={padding.top} y2={height - padding.bottom} stroke="rgba(255,255,255,0.45)" />

          <path d={buildLinePath(timePoints)} fill="none" stroke="#ff7b54" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d={buildLinePath(spacePoints)} fill="none" stroke="#2fb9b2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {timePoints.map((point, index) => (
            <circle key={`time-${x[index]}`} cx={point.x} cy={point.y} r="4" fill="#ff7b54" />
          ))}

          {spacePoints.map((point, index) => (
            <circle key={`space-${x[index]}`} cx={point.x} cy={point.y} r="4" fill="#2fb9b2" />
          ))}

          <text x={padding.left} y={18} className="fill-slate-100 text-xs font-semibold">
            Interactive Complexity Graph
          </text>
          <g transform={`translate(${width - 220}, ${padding.top - 8})`}>
            <rect width="200" height="44" rx="10" fill="rgba(15, 23, 42, 0.88)" />
            <circle cx="18" cy="15" r="5" fill="#ff7b54" />
            <text x="32" y="19" className="fill-slate-100 text-xs">Time Complexity</text>
            <circle cx="18" cy="31" r="5" fill="#2fb9b2" />
            <text x="32" y="35" className="fill-slate-100 text-xs">Space Complexity</text>
          </g>
        </svg>
      </div>
    </section>
  );
}
