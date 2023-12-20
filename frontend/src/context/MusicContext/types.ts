import type { MusicProps } from "@/utils/types";

export interface MusicTimeProps {
  currentTime: string;
  currentTimeNum: number;
  duration: string;
  durationNum: number;
  progress: number;
}

export type MusicStateProps = "playing" | "paused";

export interface MusicContextProps {
  currentMusic: MusicProps | null;
  musicState: MusicStateProps;
  musicTime: MusicTimeProps;
  musicVolume: number;
  repeatMusic: boolean;
  shufflePlaylist: boolean;
  mutatedMusic: boolean;
  playlist: MusicProps[];
  DBPlaylist: MusicProps[];
  playMusic: (music: MusicProps, playlist?: MusicProps[]) => void;
  pauseMusic: () => void;
  toggleRepeatMusic: () => void;
  toggleShufflePlaylist: () => void;
  skipMusic: () => void;
  previousMusic: () => void;
  handleMusicVolume: (value?: number) => void;
  handleMusicTime: (value: number) => void;
}
