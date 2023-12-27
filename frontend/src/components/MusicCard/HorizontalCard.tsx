"use client";

import type { MusicProps } from "@/utils/types";

import { useMemo, useState } from "react";
import { useMusic } from "@/hooks/useMusic";

import Image from "next/image";
import Link from "next/link";
import { ControlButton } from "./ControlButton";
import { ActionMenu, type ActionMenuProps } from "../ActionMenu";

interface HorizontalMusicCardProps extends ActionMenuProps {
  music: MusicProps;
  musics?: MusicProps[];
  showArtist?: boolean;
}

function HorizontalMusicCard({
  music,
  musics,
  showArtist = true,
  ...props
}: HorizontalMusicCardProps) {
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
      <div className="absolute inset-0 z-[-1] size-full scale-95 rounded-lg bg-secondary opacity-0 duration-300 group-focus-within:scale-100 group-focus-within:opacity-100 group-hover:scale-100 group-hover:opacity-100" />
      <button
        type="button"
        className="absolute inset-0 z-10 size-full rounded-lg ring-ring focus:outline-none focus:ring-2"
        title={`${musicIsPlaying ? "Pause" : "Play"} ${music.title}`}
        onKeyDown={(e) => {
          if (e.key !== "Enter" && e.key !== " ") return;
          musicIsPlaying ? pauseMusic() : playMusic(music, musics);
        }}
        onDoubleClick={() =>
          musicIsPlaying ? pauseMusic() : playMusic(music, musics)
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
        <ControlButton
          music={music}
          playlist={musics}
          buttonFocus={buttonFocus}
          orientation="horizontal"
        />
      </div>
      <div className="relative z-20 flex w-fit flex-col items-start truncate">
        <Link
          href={`/music/${music.id}`}
          className="w-full max-w-fit truncate rounded-lg border border-transparent text-lg font-bold hover:underline focus-visible:border-ring focus-visible:outline-none"
        >
          {music.title}
        </Link>
        {showArtist && (
          <Link
            href={`/artist/${music.artist.id}`}
            className="w-full max-w-fit truncate rounded-lg border border-transparent text-sm text-foreground/60 hover:underline focus-visible:border-ring focus-visible:outline-none"
          >
            {music.artist.full_name}
          </Link>
        )}
      </div>
      <ActionMenu
        {...props}
        music={music}
        actionType="music"
        actionId={music.id}
      />
    </div>
  );
}

export { HorizontalMusicCard, type HorizontalMusicCardProps };
