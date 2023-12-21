"use client";

import type { MusicProps } from "@/utils/types";
import { useMusic } from "@/hooks/useMusic";

import Image from "next/image";

import { Pause, Play } from "@phosphor-icons/react";

interface SimpleButtonControlProps {
  musicIsPlaying?: boolean;
  buttonFocus?: boolean;
  music: MusicProps;
  playlist?: MusicProps[];
  radius?: "rounded-lg" | "rounded-full";
}

export function SimpleButtonControl({
  music,
  playlist,
  radius = "rounded-lg",
  musicIsPlaying = false,
  buttonFocus = false,
}: SimpleButtonControlProps) {
  const { playMusic, pauseMusic } = useMusic();

  return (
    <button
      type="button"
      className={`group/button absolute inset-0 z-20 flex size-full items-center justify-center ${radius} border-2 border-transparent bg-black/50 ${
        musicIsPlaying || buttonFocus ? "opacity-100" : "opacity-0"
      } duration-200 focus:opacity-100 focus:outline-none focus-visible:border-primary group-hover:opacity-100`}
      onClick={() =>
        musicIsPlaying ? pauseMusic() : playMusic(music, playlist)
      }
      title={`${musicIsPlaying ? "Pause" : "Play"} ${music.title}`}
    >
      {musicIsPlaying ? (
        <>
          <Image
            src="/musicPlaying.gif"
            alt="Music is playing"
            className={`${
              buttonFocus ? "hidden" : "flex"
            } group-hover:hidden group-focus/button:hidden`}
            height={24}
            width={24}
          />
          <Pause
            size={24}
            weight="fill"
            className={`${
              buttonFocus ? "flex" : "hidden"
            } duration-200 group-hover:flex group-hover/button:text-primary group-focus/button:flex`}
          />
        </>
      ) : (
        <Play
          size={24}
          weight="fill"
          className={`${
            buttonFocus ? "scale-100" : "scale-0"
          } duration-200 group-hover:scale-100 group-hover/button:text-primary group-focus/button:scale-100`}
        />
      )}
    </button>
  );
}
