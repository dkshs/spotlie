import type { MusicStateProps } from "@/context/MusicContext";
import type { BaseType } from "./types";

import { BaseControl } from "./BaseControl";
import { Pause, Play } from "@phosphor-icons/react";

interface PlayPauseControlProps extends BaseType {
  musicState: MusicStateProps;
}

export function PlayPauseControl({
  musicState,
  isMiniPlayer = false,
  ...props
}: PlayPauseControlProps) {
  const iconSize = isMiniPlayer ? 24 : 26;

  return (
    <BaseControl
      {...props}
      isPlayPauseControl
      title={`${musicState === "playing" ? "Pausar" : "Play"}`}
      className="bg-zinc-800 hover:bg-zinc-900"
    >
      {musicState === "playing" ? (
        <Pause size={iconSize} weight="fill" />
      ) : (
        <Play size={iconSize} weight="fill" />
      )}
    </BaseControl>
  );
}
