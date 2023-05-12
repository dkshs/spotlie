import type { BaseType } from "./types";

import { BaseControl } from "./BaseControl";
import { Shuffle } from "@phosphor-icons/react";

interface ShufflePlaylistControlProps extends BaseType {
  shufflePlaylist: boolean;
}

export function ShufflePlaylistControl({
  shufflePlaylist,
  isMiniPlayer = false,
  ...props
}: ShufflePlaylistControlProps) {
  const iconSize = isMiniPlayer ? 24 : 26;

  return (
    <BaseControl
      {...props}
      title={`${shufflePlaylist ? "Desativar" : "Ativar"} a ordem aleatória`}
      className={`${isMiniPlayer ? "hidden xs:inline-flex" : ""} ${
        shufflePlaylist && "text-blue-600"
      }`}
    >
      <Shuffle size={iconSize} weight="fill" />
    </BaseControl>
  );
}
