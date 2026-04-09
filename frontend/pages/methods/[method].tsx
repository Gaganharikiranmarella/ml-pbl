import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Graph from "@/components/Graph";
import InteractiveExample from "@/components/InteractiveExample";
import ToggleTheme from "@/components/ToggleTheme";
import { METHODS, isMethodId } from "@/lib/methods";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const revealItem = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

export default function MethodPage() {
  const router = useRouter();
  const methodParam = router.query.method;

  if (typeof methodParam !== "string" || !isMethodId(methodParam)) {
    return (
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4">
        <div className="rounded-2xl border border-slate-300/40 bg-white/60 p-8 dark:border-slate-200/10 dark:bg-slate-900/40">
          <h1 className="text-2xl font-bold">Method not found</h1>
          <Link href="/" className="mt-4 inline-block text-lagoon underline">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const method = METHODS[methodParam];

  return (
    <>
      <Head>
        <title>{method.title} | QOC RL Lab</title>
      </Head>
      <motion.div
        className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8 md:px-10"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <motion.header variants={revealItem} className="mb-8 flex items-start justify-between gap-4">
          <div>
            <Link href="/" className="text-sm text-lagoon underline">
              Back to methods
            </Link>
            <h1 className="mt-2 text-3xl font-bold md:text-5xl">{method.title}</h1>
            <p className="mt-1 text-slate-700 dark:text-slate-300">{method.subtitle}</p>
          </div>
          <ToggleTheme />
        </motion.header>

        <section className="grid gap-5">
          <motion.article variants={revealItem} className="rounded-2xl border border-slate-300/40 bg-white/60 p-6 dark:border-slate-200/10 dark:bg-slate-900/40">
            <h2 className="text-xl font-semibold">Theory</h2>
            <p className="mt-2 leading-relaxed text-slate-700 dark:text-slate-300">{method.theory}</p>
          </motion.article>

          <motion.article variants={revealItem} className="rounded-2xl border border-slate-300/40 bg-white/60 p-6 dark:border-slate-200/10 dark:bg-slate-900/40">
            <h2 className="text-xl font-semibold">Code</h2>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-ink p-4 text-sm text-slate-100">
              <code>{method.code}</code>
            </pre>
          </motion.article>

          <motion.article variants={revealItem}>
            <h2 className="mb-3 text-xl font-semibold">Graph</h2>
            <Graph method={method} />
          </motion.article>

          <motion.article variants={revealItem} className="rounded-2xl border border-slate-300/40 bg-white/60 p-6 dark:border-slate-200/10 dark:bg-slate-900/40">
            <h2 className="text-xl font-semibold">Example</h2>
            <p className="mt-2 leading-relaxed text-slate-700 dark:text-slate-300">{method.example}</p>
            <div className="mt-4">
              <InteractiveExample method={method} />
            </div>
          </motion.article>
        </section>
      </motion.div>
    </>
  );
}
