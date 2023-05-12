import type { BaseType } from "./types";

import { BaseControl } from "./BaseControl";
import { SkipBack, SkipForward } from "@phosphor-icons/react";

interface PreviousNextMusicControlProps extends BaseType {
  isPreviousMusicControl?: boolean;
}

export function PreviousNextMusicControl({
  isPreviousMusicControl = false,
  isMiniPlayer = false,
  ...props
}: PreviousNextMusicControlProps) {
  const iconSize = isMiniPlayer ? 24 : 26;

  return (
    <BaseControl
      {...props}
      title={`${isPreviousMusicControl ? "Voltar" : "Avançar"}`}
    >
      {isPreviousMusicControl ? (
        <SkipBack size={iconSize} weight="fill" />
      ) : (
        <SkipForward size={iconSize} weight="fill" />
      )}
    </BaseControl>
  );
}
