import { useMusic } from "@/hooks/useMusic";

import type { MusicProps } from "@/utils/types";

import Image from "next/image";
import Link from "next/link";

import { Pause, Play } from "phosphor-react";

interface SimpleMusicCardProps {
  music: MusicProps;
  showArtist?: boolean;
}

export function SimpleMusicCard({
  music,
  showArtist = true,
}: SimpleMusicCardProps) {
  const { currentMusic, playMusic, pauseMusic, musicState } = useMusic();

  return (
    <button
      type="button"
      onDoubleClick={() =>
        musicState === "playing" && currentMusic?.id === music.id
          ? pauseMusic()
          : playMusic(music)
      }
      className={`flex items-center px-4 py-2 rounded-md gap-3 ${
        musicState === "playing" && music.id === currentMusic?.id
          ? "bg-black/40"
          : musicState === "paused" &&
            music.id === currentMusic?.id &&
            "bg-black/20"
      } hover:bg-black/30 focus:outline-none focus:bg-black/50 group duration-200`}
    >
      <div className="relative rounded-lg min-w-[50px] min-h-[50px]">
        <Image
          className="aspect-square rounded-lg object-cover shadow-lg bg-black/40"
          src={music.cover}
          alt={music.title}
          width={50}
          height={50}
        />
        <div
          className={`absolute rounded-lg justify-center items-center inset-0 ${
            (musicState === "playing" && music.id === currentMusic?.id) ||
            (musicState === "paused" && music.id === currentMusic?.id)
              ? "flex bg-black/50"
              : "hidden group-hover:flex group-hover:bg-black/50"
          }`}
        >
          <div className="rounded-full duration-200">
            {musicState === "playing" && currentMusic?.id === music.id ? (
              <>
                <Image
                  src="/musicPlaying.gif"
                  alt="Música tocando"
                  className="group-hover:hidden flex"
                  height={24}
                  width={24}
                />
                <Pause
                  size={24}
                  weight="fill"
                  className="hidden hover:text-purple-400 group-hover:flex duration-300"
                />
              </>
            ) : (
              <Play
                size={24}
                weight="fill"
                className="hover:text-purple-400 duration-300"
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-0.5 text-base font-normal truncate text-start">
        <Link
          href={`/music/${music.id}`}
          className="focus:outline-none truncate pr-2.5 focus:text-purple-400 hover:text-purple-400 active:opacity-70 duration-200"
        >
          {music.title}
        </Link>
        {showArtist && (
          <div className="truncate pr-2.5">
            <Link
              key={music.artist.id}
              href={`/artist/${music.artist.id}`}
              className="focus:outline-none focus:text-purple-400 hover:text-purple-400 active:opacity-70 duration-200"
            >
              {music.artist.name}
            </Link>
          </div>
        )}
      </div>
    </button>
  );
}
