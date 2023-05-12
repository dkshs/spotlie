import { PlayPauseControl } from "./PlayPauseControl";
import { PreviousNextMusicControl } from "./PreviousNextMusicControl";
import { RepeatMusicControl } from "./RepeatMusicControl";
import { ShufflePlaylistControl } from "./ShufflePlaylistControl";
import { VolumeControl } from "./VolumeControl";

export const Control = {
  PlayPause: PlayPauseControl,
  Volume: VolumeControl,
  ShufflePlaylist: ShufflePlaylistControl,
  PreviousNextMusic: PreviousNextMusicControl,
  RepeatMusic: RepeatMusicControl,
};
