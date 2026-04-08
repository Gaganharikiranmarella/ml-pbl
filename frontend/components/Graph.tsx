import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { MethodContent } from "@/types/method";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface Props {
  method: MethodContent;
}

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

      <Plot
        data={[
          {
            x,
            y: points.map((p) => p.time),
            type: "scatter",
            mode: "lines+markers",
            name: "Time Complexity",
            line: { color: "#ff7b54", width: 3 },
          },
          {
            x,
            y: points.map((p) => p.space),
            type: "scatter",
            mode: "lines+markers",
            name: "Space Complexity",
            yaxis: "y2",
            line: { color: "#2fb9b2", width: 3 },
          },
        ]}
        layout={{
          autosize: true,
          margin: { l: 50, r: 50, t: 30, b: 50 },
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: "rgba(0,0,0,0)",
          xaxis: {
            title: { text: "Problem Size (n)" },
            gridcolor: "rgba(120,120,120,0.15)",
          },
          yaxis: {
            title: { text: "Time" },
            gridcolor: "rgba(120,120,120,0.15)",
          },
          yaxis2: {
            title: { text: "Space" },
            overlaying: "y",
            side: "right",
          },
          legend: { orientation: "h", y: -0.2 },
          font: { family: "Space Grotesk, sans-serif", color: "#d7deff" },
        }}
        config={{ responsive: true, displaylogo: false }}
        style={{ width: "100%", height: "420px" }}
      />
    </section>
  );
}
