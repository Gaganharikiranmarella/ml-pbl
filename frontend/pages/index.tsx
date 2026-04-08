import Head from "next/head";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import MethodCard from "@/components/MethodCard";
import ToggleTheme from "@/components/ToggleTheme";
import { METHODS, METHOD_ORDER } from "@/lib/methods";

export default function HomePage() {
  const [showIntroMessage, setShowIntroMessage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntroMessage(false);
    }, 2600);

    return () => clearTimeout(timer);
  }, []);

  if (showIntroMessage) {
    return (
      <>
        <Head>
          <title>RL for Quantum Optimal Control</title>
          <meta
            name="description"
            content="Interactive reinforcement-learning inspired methods for Quantum Optimal Control."
          />
        </Head>

        <div className="flex min-h-screen items-center justify-center px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -18, filter: "blur(4px)" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-3xl text-lg font-medium leading-relaxed text-slate-800 dark:text-slate-100 md:text-2xl"
          >
            Presented for Geethanjali College of Engineering and Technology, 2023 - 2027 ML PBL
            Title
          </motion.p>
        </div>
      </>
    );
  }

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
        <header className="mx-auto mb-8 flex w-full max-w-6xl justify-end">
          <ToggleTheme />
        </header>

        <section className="mx-auto mb-14 w-full max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="rounded-3xl border border-slate-300/40 bg-white/65 p-6 shadow-halo backdrop-blur dark:border-slate-200/10 dark:bg-slate-900/40 md:p-10"
          >
            <h1 className="mt-3 text-3xl font-bold leading-tight md:text-5xl">
              Reinforcement Learning in Quantum Optimal Control
            </h1>
            <p className="mt-5 text-base text-slate-700 dark:text-slate-300 md:text-lg">
              Presented by Marella Gagan Hari Kiran - 23R11A66J2
            </p>
            <p className="mt-1 text-base text-slate-700 dark:text-slate-300 md:text-lg">
              Lodi Shiva Prasad Goud - 23R11A66H8
            </p>
          </motion.div>
        </section>

        <section className="mx-auto w-full max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2, ease: "easeOut" }}
          >
            <p className="max-w-2xl text-sm text-slate-700 dark:text-slate-300 md:text-base">
              Explore GRAPE, Krotov, Pontryagin, and Shortcuts to Adiabaticity with interactive
              complexity plots, concise theory, and implementation snippets.
            </p>
          </motion.div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {METHOD_ORDER.map((id, index) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.32 + 0.08 * index }}
              >
                <MethodCard method={METHODS[id]} />
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
