import type { BaseType } from "./types";

import { BaseControl } from "./BaseControl";
import { Repeat, RepeatOnce } from "@phosphor-icons/react";

interface RepeatMusicControlProps extends BaseType {
  repeatMusic: boolean;
}

export function RepeatMusicControl({
  repeatMusic,
  isMiniPlayer = false,
  ...props
}: RepeatMusicControlProps) {
  const iconSize = isMiniPlayer ? 24 : 26;

  return (
    <BaseControl
      {...props}
      title={`${repeatMusic ? "Não repetir" : "Repetir"}`}
      className={`${isMiniPlayer ? "hidden xs:inline-flex" : ""} ${
        repeatMusic && "text-blue-600"
      }`}
    >
      {repeatMusic ? (
        <RepeatOnce size={iconSize} weight="fill" />
      ) : (
        <Repeat size={iconSize} weight="fill" />
      )}
    </BaseControl>
  );
}
