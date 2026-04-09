import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  const [showTime, setShowTime] = useState(true);
  const [showSpace, setShowSpace] = useState(true);
  const [activeN, setActiveN] = useState<number | null>(null);

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
  const activePoint = points.find((point) => point.n === activeN) ?? null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="rounded-2xl border border-slate-300/40 bg-white/60 p-4 shadow-halo backdrop-blur dark:border-slate-200/10 dark:bg-slate-900/40"
    >
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

      <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
        <label className="inline-flex items-center gap-2 rounded-full border border-slate-300/40 px-3 py-1 dark:border-slate-200/20">
          <input type="checkbox" checked={showTime} onChange={(e) => setShowTime(e.target.checked)} />
          <span>Show Time</span>
        </label>
        <label className="inline-flex items-center gap-2 rounded-full border border-slate-300/40 px-3 py-1 dark:border-slate-200/20">
          <input type="checkbox" checked={showSpace} onChange={(e) => setShowSpace(e.target.checked)} />
          <span>Show Space</span>
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

          {showTime ? (
            <motion.path
              key={`time-${timeScale}-${showTime}`}
              d={buildLinePath(timePoints)}
              fill="none"
              stroke="#ff7b54"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0.5 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          ) : null}
          {showSpace ? (
            <motion.path
              key={`space-${spaceScale}-${showSpace}`}
              d={buildLinePath(spacePoints)}
              fill="none"
              stroke="#2fb9b2"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0.5 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
            />
          ) : null}

          {showTime
            ? timePoints.map((point, index) => (
                <motion.circle
                  key={`time-${x[index]}`}
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="#ff7b54"
                  onMouseEnter={() => setActiveN(x[index])}
                  onMouseLeave={() => setActiveN(null)}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.18, delay: index * 0.02 }}
                />
              ))
            : null}

          {showSpace
            ? spacePoints.map((point, index) => (
                <motion.circle
                  key={`space-${x[index]}`}
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="#2fb9b2"
                  onMouseEnter={() => setActiveN(x[index])}
                  onMouseLeave={() => setActiveN(null)}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.18, delay: index * 0.02 }}
                />
              ))
            : null}

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

          <AnimatePresence>
            {activePoint ? (
              <motion.g
                key={`tooltip-${activePoint.n}`}
                transform={`translate(${padding.left + 8}, ${padding.top + 8})`}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16 }}
              >
                <rect width="200" height="58" rx="10" fill="rgba(15, 23, 42, 0.9)" />
                <text x="10" y="18" className="fill-slate-100 text-xs">
                  n = {activePoint.n}
                </text>
                <text x="10" y="34" className="fill-slate-100 text-xs">
                  Time = {activePoint.time.toFixed(2)}
                </text>
                <text x="10" y="50" className="fill-slate-100 text-xs">
                  Space = {activePoint.space.toFixed(2)}
                </text>
              </motion.g>
            ) : null}
          </AnimatePresence>
        </svg>
      </div>
    </motion.section>
  );
}
