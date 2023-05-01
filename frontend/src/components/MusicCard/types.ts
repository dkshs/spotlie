import type { MusicProps } from "@/utils/types";

export interface MusicCardIconProps {
  musicState: "playing" | "paused";
  currentMusic: MusicProps | null;
  music: MusicProps;
}
