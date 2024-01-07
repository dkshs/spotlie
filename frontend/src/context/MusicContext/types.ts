import type { MusicProps, PlaylistPropsWithMusics } from "@/utils/types";

export interface MusicTimeProps {
  currentTime: string;
  currentTimeNum: number;
  duration: string;
  durationNum: number;
  progress: number;
}

export type MusicStateProps = "playing" | "paused";

export interface PlayMusicProps {
  music: MusicProps;
  otherPlaylist?: PlaylistPropsWithMusics | null;
  musics?: MusicProps[];
}

export interface MusicContextProps {
  currentMusic: MusicProps | null;
  musicState: MusicStateProps;
  musicTime: MusicTimeProps;
  musicVolume: number;
  repeatMusic: boolean;
  shufflePlaylist: boolean;
  mutatedMusic: boolean;
  playlist: PlaylistPropsWithMusics | null;
  playMusic: (props: PlayMusicProps) => void;
  pauseMusic: () => void;
  toggleRepeatMusic: () => void;
  toggleShufflePlaylist: () => void;
  skipMusic: () => void;
  previousMusic: () => void;
  handleMusicVolume: (value?: number) => void;
  handleMusicTime: (value: number) => void;
}
