import "../styles/global.css";
import type { AppProps } from "next/app";
import { Header } from "@/components/Header";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="max-w-7xl min-w-[320px] m-auto">
      <Header />
      <div className="pt-[72px]">
        <Component {...pageProps} />
      </div>
    </div>
  );
}
