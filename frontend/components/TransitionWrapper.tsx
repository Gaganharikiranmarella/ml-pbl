import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";
import { useRouter } from "next/router";

interface Props {
  children: ReactNode;
}

export default function TransitionWrapper({ children }: Props) {
  const router = useRouter();

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={router.asPath}
        initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -18, filter: "blur(4px)" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}
