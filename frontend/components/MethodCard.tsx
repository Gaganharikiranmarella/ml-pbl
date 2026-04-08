import Link from "next/link";
import { motion } from "framer-motion";
import { MethodContent } from "@/types/method";

interface Props {
  method: MethodContent;
}

export default function MethodCard({ method }: Props) {
  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.25 }}
      className="group rounded-2xl border border-slate-300/40 bg-white/60 p-5 shadow-halo backdrop-blur dark:border-slate-200/10 dark:bg-slate-900/35"
    >
      <h3 className="text-xl font-semibold">{method.title}</h3>
      <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{method.subtitle}</p>
      <p className="mt-3 line-clamp-3 text-sm text-slate-700 dark:text-slate-300">{method.theory}</p>
      <Link
        href={`/methods/${method.id}`}
        className="mt-4 inline-block rounded-full bg-gradient-to-r from-sunrise to-citrus px-4 py-2 text-sm font-semibold text-ink"
      >
        Explore Method
      </Link>
    </motion.article>
  );
}
