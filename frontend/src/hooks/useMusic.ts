import { useContext } from "react";
import { MusicContext } from "@/context/MusicContext";

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    console.warn("MusicContext is undefined in useMusic()");
    throw new Error(`useMusic must be used within a MusicContextProvider.`);
  }
  return context;
};
