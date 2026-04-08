import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import TransitionWrapper from "@/components/TransitionWrapper";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TransitionWrapper>
        <Component {...pageProps} />
      </TransitionWrapper>
    </ThemeProvider>
  );
}
