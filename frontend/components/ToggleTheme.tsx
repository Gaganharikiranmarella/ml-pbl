import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ToggleTheme() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <button className="rounded-full border px-4 py-2 text-sm">Theme</button>;
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-full border border-slate-400/40 bg-white/50 px-4 py-2 text-sm font-medium text-ink backdrop-blur dark:border-slate-200/30 dark:bg-slate-900/40 dark:text-slate-100"
      aria-label="Toggle light and dark mode"
    >
      {isDark ? "Switch to Light" : "Switch to Dark"}
    </button>
  );
}
