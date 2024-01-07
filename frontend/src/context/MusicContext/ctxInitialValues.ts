import type { MusicContextProps } from "./types";

export const ctxInitialValues: MusicContextProps = {
  currentMusic: null,
  musicState: "paused",
  musicTime: {
    currentTime: "00:00",
    currentTimeNum: 0,
    duration: "00:00",
    durationNum: 0,
    progress: 0,
  },
  musicVolume: 1,
  repeatMusic: false,
  shufflePlaylist: false,
  mutatedMusic: false,
  playlist: null,
  playMusic: (): void => {
    throw new Error("playMusic() not implemented.");
  },
  pauseMusic: (): void => {
    throw new Error("pauseMusic() not implemented.");
  },
  toggleRepeatMusic: (): void => {
    throw new Error("toggleRepeatMusic() not implemented.");
  },
  toggleShufflePlaylist: (): void => {
    throw new Error("toggleShufflePlaylist() not implemented.");
  },
  skipMusic: (): void => {
    throw new Error("skipMusic() not implemented.");
  },
  previousMusic: (): void => {
    throw new Error("previousMusic() not implemented.");
  },
  handleMusicVolume: (): void => {
    throw new Error("handleMusicVolume() not implemented.");
  },
  handleMusicTime: (): void => {
    throw new Error("handleMusicTime() not implemented.");
  },
};
