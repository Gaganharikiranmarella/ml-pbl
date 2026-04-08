import Head from "next/head";
import { motion } from "framer-motion";
import MethodCard from "@/components/MethodCard";
import ToggleTheme from "@/components/ToggleTheme";
import { METHODS, METHOD_ORDER } from "@/lib/methods";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>RL for Quantum Optimal Control</title>
        <meta
          name="description"
          content="Interactive reinforcement-learning inspired methods for Quantum Optimal Control."
        />
      </Head>

      <div className="min-h-screen px-4 py-8 md:px-10">
        <header className="mx-auto mb-10 flex w-full max-w-6xl items-start justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm uppercase tracking-[0.25em] text-lagoon">QOC RL Lab</p>
            <h1 className="mt-2 text-3xl font-bold leading-tight md:text-5xl">
              Reinforcement Learning Methods for Quantum Optimal Control
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-slate-700 dark:text-slate-300 md:text-base">
              Explore GRAPE, Krotov, Pontryagin, and Shortcuts to Adiabaticity with interactive
              complexity plots, concise theory, and implementation snippets.
            </p>
          </motion.div>
          <ToggleTheme />
        </header>

        <section className="mx-auto grid w-full max-w-6xl gap-4 md:grid-cols-2">
          {METHOD_ORDER.map((id, index) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 * index }}
            >
              <MethodCard method={METHODS[id]} />
            </motion.div>
          ))}
        </section>
      </div>
    </>
  );
}
