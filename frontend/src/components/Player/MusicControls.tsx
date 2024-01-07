"use client";

import { useMusic } from "@/hooks/useMusic";
import { useWindowSize } from "usehooks-ts";

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "../ui/Button";

import {
  Pause,
  Play,
  Repeat,
  RepeatOnce,
  Shuffle,
  SkipBack,
  SkipForward,
} from "@phosphor-icons/react";

function ControlButton({ className, ...props }: ButtonProps) {
  return (
    <Button
      {...props}
      radius="full"
      variant="ghost"
      size="icon"
      className={cn("scale-100", className)}
    />
  );
}

export function MusicControls() {
  const { width } = useWindowSize();
  const {
    currentMusic,
    musicState,
    playMusic,
    pauseMusic,
    playlist,
    skipMusic,
    previousMusic,
    shufflePlaylist,
    repeatMusic,
    toggleShufflePlaylist,
    toggleRepeatMusic,
  } = useMusic();

  if (!currentMusic) return null;

  return (
    <div className="flex gap-2">
      {width >= 768 && (
        <ControlButton
          onClick={() => toggleShufflePlaylist()}
          className={`${shufflePlaylist ? "text-primary" : ""}`}
        >
          <Shuffle weight="fill" size={18} />
        </ControlButton>
      )}
      <ControlButton onClick={() => previousMusic()}>
        <SkipBack weight="fill" size={18} />
      </ControlButton>
      <ControlButton
        className="scale-110 hover:scale-125"
        onClick={() =>
          musicState === "playing"
            ? pauseMusic()
            : playMusic({ music: currentMusic, otherPlaylist: playlist })
        }
      >
        {musicState === "playing" ? (
          <Pause weight="fill" size={20} />
        ) : (
          <Play weight="fill" size={20} />
        )}
      </ControlButton>
      <ControlButton onClick={() => skipMusic()}>
        <SkipForward weight="fill" size={18} />
      </ControlButton>
      {width >= 768 && (
        <ControlButton
          onClick={() => toggleRepeatMusic()}
          className={`${repeatMusic ? "text-primary" : ""}`}
        >
          {repeatMusic ? (
            <RepeatOnce weight="fill" size={18} />
          ) : (
            <Repeat weight="fill" size={18} />
          )}
        </ControlButton>
      )}
    </div>
  );
}
