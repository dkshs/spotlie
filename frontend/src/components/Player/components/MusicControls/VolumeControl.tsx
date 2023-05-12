import type { BaseType } from "./types";

import { BaseControl } from "./BaseControl";
import { SpeakerHigh, SpeakerLow, SpeakerSlash } from "@phosphor-icons/react";

interface VolumeControlProps extends BaseType {
  mutatedMusic: boolean;
  musicVolume: number;
}

export function VolumeControl({
  mutatedMusic,
  musicVolume,
  isMiniPlayer = false,
  ...props
}: VolumeControlProps) {
  const iconSize = isMiniPlayer ? 24 : 26;

  return (
    <BaseControl {...props} title={mutatedMusic ? "Com som" : "Mudo"}>
      {mutatedMusic ? (
        <SpeakerSlash size={iconSize} />
      ) : musicVolume <= 0.5 ? (
        <SpeakerLow size={iconSize} />
      ) : (
        <SpeakerHigh size={iconSize} />
      )}
    </BaseControl>
  );
}
