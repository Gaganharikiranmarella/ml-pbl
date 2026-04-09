import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MethodContent } from "@/types/method";

interface Props {
  method: MethodContent;
}

type Metrics = {
  fidelity: number;
  iterations: number;
  energy: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const formatNumber = (value: number, digits = 2) => value.toFixed(digits);

export default function InteractiveExample({ method }: Props) {
  const { exampleLab } = method;

  const [values, setValues] = useState<Record<string, number>>(() =>
    exampleLab.controls.reduce<Record<string, number>>((acc, control) => {
      acc[control.key] = control.defaultValue;
      return acc;
    }, {}),
  );

  const [sampleSize, setSampleSize] = useState(64);

  const metrics = useMemo<Metrics>(() => {
    let fidelity = exampleLab.baseline.fidelity;
    let iterations = exampleLab.baseline.iterations;
    let energy = exampleLab.baseline.energy;

    for (const control of exampleLab.controls) {
      const current = values[control.key] ?? control.defaultValue;
      const span = control.max - control.min || 1;
      const normalizedDelta = (current - control.defaultValue) / span;
      const sensitivity = exampleLab.sensitivity[control.key];

      fidelity += normalizedDelta * sensitivity.fidelity;
      iterations += normalizedDelta * sensitivity.iterations;
      energy += normalizedDelta * sensitivity.energy;
    }

    return {
      fidelity: clamp(fidelity, 0.65, 0.995),
      iterations: Math.round(clamp(iterations, 40, 240)),
      energy: clamp(energy, 0.2, 1.8),
    };
  }, [exampleLab, values]);

  const explanation = useMemo(() => {
    if (metrics.fidelity > 0.95) {
      return "High-quality transfer: the policy is reaching the target very reliably.";
    }
    if (metrics.fidelity > 0.9) {
      return "Balanced run: good accuracy with manageable training effort.";
    }
    return "Challenging setup: lower accuracy means the controller needs gentler or cleaner settings.";
  }, [metrics.fidelity]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl border border-slate-300/40 bg-white/60 p-6 shadow-halo backdrop-blur dark:border-slate-200/10 dark:bg-slate-900/40"
    >
      <h3 className="text-lg font-semibold">{exampleLab.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{exampleLab.description}</p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {exampleLab.controls.map((control, index) => (
          <motion.label
            key={control.key}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.25, delay: index * 0.06 }}
            whileHover={{ y: -2 }}
            className="rounded-xl border border-slate-300/30 bg-white/70 p-3 dark:border-slate-200/10 dark:bg-slate-950/30"
          >
            <div className="flex items-center justify-between text-sm font-medium">
              <span>{control.label}</span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={`${control.key}-${values[control.key] ?? control.defaultValue}`}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.16 }}
                >
                  {formatNumber(values[control.key] ?? control.defaultValue)}
                  {control.unit ? ` ${control.unit}` : ""}
                </motion.span>
              </AnimatePresence>
            </div>
            <input
              type="range"
              min={control.min}
              max={control.max}
              step={control.step}
              value={values[control.key] ?? control.defaultValue}
              onChange={(event) => {
                const next = Number(event.target.value);
                setValues((prev) => ({ ...prev, [control.key]: next }));
              }}
              className="mt-2 w-full"
            />
          </motion.label>
        ))}
      </div>

      <div className="mt-5 rounded-xl border border-slate-300/30 bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-slate-100 dark:border-slate-200/10">
        <div className="grid gap-2 sm:grid-cols-3">
          <p className="text-sm">
            Fidelity
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={`fidelity-${metrics.fidelity.toFixed(3)}`}
                className="mt-1 block text-xl font-semibold"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.14 }}
              >
                {formatNumber(metrics.fidelity, 3)}
              </motion.span>
            </AnimatePresence>
          </p>
          <p className="text-sm">
            Episodes
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={`episodes-${metrics.iterations}`}
                className="mt-1 block text-xl font-semibold"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.14 }}
              >
                {metrics.iterations}
              </motion.span>
            </AnimatePresence>
          </p>
          <p className="text-sm">
            Energy Cost
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={`energy-${metrics.energy.toFixed(3)}`}
                className="mt-1 block text-xl font-semibold"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.14 }}
              >
                {formatNumber(metrics.energy, 3)}
              </motion.span>
            </AnimatePresence>
          </p>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={explanation}
            className="mt-3 text-sm text-slate-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {explanation}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="mt-5 rounded-xl border border-slate-300/30 bg-white/70 p-4 dark:border-slate-200/10 dark:bg-slate-950/30">
        <label className="text-sm font-medium" htmlFor="sampleSize">
          Sample Size: {sampleSize}
        </label>
        <input
          id="sampleSize"
          type="range"
          min={16}
          max={256}
          step={16}
          value={sampleSize}
          onChange={(event) => setSampleSize(Number(event.target.value))}
          className="mt-2 w-full"
        />
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
          Estimated runtime for this scenario: {Math.round((metrics.iterations * sampleSize) / 20)} ms
        </p>
      </div>
    </motion.section>
  );
}
