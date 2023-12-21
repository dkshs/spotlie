"use client";

import type { MusicProps } from "@/utils/types";

import { useMemo, useState } from "react";
import { useMusic } from "@/hooks/useMusic";

import Image from "next/image";
import Link from "next/link";

import { Pause, Play } from "@phosphor-icons/react";

interface SimpleMusicCardProps {
  music: MusicProps;
  playlist?: MusicProps[];
}

export function SimpleMusicCard({ music, playlist }: SimpleMusicCardProps) {
  const { currentMusic, musicState, playMusic, pauseMusic } = useMusic();
  const [buttonFocus, setButtonFocus] = useState(false);
  const musicIsPlaying = useMemo(
    () => currentMusic?.id === music.id && musicState === "playing",
    [currentMusic?.id, music.id, musicState],
  );

  return (
    <div
      className={`group relative flex items-center gap-3 rounded-lg ${
        musicIsPlaying ? "bg-secondary/70" : "bg-secondary/40"
      } px-2 py-1 duration-200`}
      id={music.id}
    >
      <div className="absolute inset-0 z-[-1] size-full scale-95 rounded-lg bg-secondary opacity-0 duration-300 group-focus-within:scale-100 group-focus-within:bg-secondary group-focus-within:opacity-100 group-hover:scale-100 group-hover:opacity-100" />
      <button
        type="button"
        className="absolute inset-0 z-10 size-full rounded-lg ring-ring focus:outline-none focus:ring-2"
        title={`${musicIsPlaying ? "Pause" : "Play"} ${music.title}`}
        onKeyDown={(e) => {
          if (e.key !== "Enter" && e.key !== " ") return;
          musicIsPlaying ? pauseMusic() : playMusic(music, playlist);
        }}
        onDoubleClick={() =>
          musicIsPlaying ? pauseMusic() : playMusic(music, playlist)
        }
        onFocus={() => setButtonFocus(true)}
        onBlur={() => setButtonFocus(false)}
      />
      <div className="relative size-[50px] min-w-fit rounded-lg bg-background bg-gradient-to-tr from-background/60 to-primary/20">
        {music.image && (
          <Image
            alt={music.title}
            src={music.image}
            className="aspect-square size-[50px] rounded-lg object-cover shadow-lg shadow-background/60"
            width={50}
            height={50}
          />
        )}
        <button
          type="button"
          className={`group/button absolute inset-0 z-20 flex size-full items-center justify-center rounded-lg border-2 border-transparent bg-black/50 ${
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
      </div>
      <div className="relative z-20 flex w-fit flex-col items-start truncate">
        <Link
          href={`/music/${music.id}`}
          className="w-full max-w-fit truncate rounded-lg border border-transparent text-lg font-bold hover:underline focus-visible:border-ring focus-visible:outline-none"
        >
          {music.title}
        </Link>
        <Link
          href={`/artist/${music.artist.id}`}
          className="w-full max-w-fit truncate rounded-lg border border-transparent text-sm hover:underline focus-visible:border-ring focus-visible:outline-none"
        >
          {music.artist.username}
        </Link>
      </div>
    </div>
  );
}
