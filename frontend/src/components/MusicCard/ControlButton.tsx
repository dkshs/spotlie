"use client";

import type { MusicProps } from "@/utils/types";

import { useMusic } from "@/hooks/useMusic";
import { Button } from "../ui/Button";
import Image from "next/image";

import { Pause, Play } from "@phosphor-icons/react";

interface ControlButtonProps {
  music: MusicProps;
  playlist?: MusicProps[];
}

export function ControlButton({ music, playlist }: ControlButtonProps) {
  const { currentMusic, musicState, playMusic, pauseMusic } = useMusic();
  const musicIsPlaying =
    currentMusic?.id === music.id && musicState === "playing";

  return (
    <Button
      type="button"
      className={`absolute bottom-0 right-0 z-20 mb-2 mr-3 h-12 w-12 ${
        musicIsPlaying ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } duration-200 focus:translate-y-0 focus:opacity-100 group-hover:translate-y-0 group-hover:opacity-100`}
      radius="full"
      size="icon"
      title={`${musicIsPlaying ? "Pause" : "Play"} music ${music.title}`}
      onClick={() =>
        musicIsPlaying ? pauseMusic() : playMusic(music, playlist)
      }
    >
      {musicIsPlaying ? (
        <>
          <Image
            src="/musicPlaying.gif"
            alt="Music is playing"
            className="flex group-hover:hidden group-focus:hidden"
            height={32}
            width={32}
            onLoadStart={() => (
              <Pause
                size={24}
                weight="fill"
                className="hidden group-hover:flex group-focus:flex"
              />
            )}
          />
          <Pause
            size={24}
            weight="fill"
            className="hidden group-hover:flex group-focus:flex"
          />
        </>
      ) : (
        <Play size={24} weight="fill" />
      )}
    </Button>
  );
}
