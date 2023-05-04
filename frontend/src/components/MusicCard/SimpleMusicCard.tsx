import { Dispatch, SetStateAction, useEffect } from "react";
import { useMusic } from "@/hooks/useMusic";

import type { MusicProps } from "@/utils/types";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SimpleMusicCardIcon } from "./IconContainer";

interface SimpleMusicCardProps {
  music: MusicProps;
  showArtist?: boolean;
  playlist?: MusicProps[];
  musicSelected?: string | null;
  setMusicSelected?: Dispatch<SetStateAction<string | null>>;
}

export function SimpleMusicCard({
  music,
  showArtist = true,
  playlist,
  musicSelected = null,
  setMusicSelected,
}: SimpleMusicCardProps) {
  const { currentMusic, playMusic, pauseMusic, musicState } = useMusic();

  useEffect(() => {
    setMusicSelected &&
      setMusicSelected(currentMusic?.id ? currentMusic.id : null);
  }, [currentMusic?.id, setMusicSelected]);

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      onHoverStart={() => setMusicSelected && setMusicSelected(music.id)}
      onHoverEnd={() => setMusicSelected && setMusicSelected(null)}
      onFocus={() => setMusicSelected && setMusicSelected(music.id)}
      onBlur={() => setMusicSelected && setMusicSelected(null)}
      type="button"
      title={`${
        musicState === "playing" && currentMusic?.id === music.id
          ? "Pausar"
          : "Reproduzir"
      } ${music.title}`}
      onKeyDown={(e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        musicState === "playing" && currentMusic?.id === music.id
          ? pauseMusic()
          : playMusic(music, playlist);
      }}
      onDoubleClick={() =>
        musicState === "playing" && currentMusic?.id === music.id
          ? pauseMusic()
          : playMusic(music, playlist)
      }
      className={`flex items-center px-4 py-2 rounded-md gap-3 w-full ${
        musicState === "playing" && music.id === currentMusic?.id
          ? "bg-black/40"
          : musicState === "paused" &&
            music.id === currentMusic?.id &&
            "bg-black/20"
      } hover:bg-black/30 focus:outline-none focus:bg-black/50 group duration-200 focus:ring-2 ring-purple-600`}
    >
      <div className="relative rounded-lg min-w-[50px] min-h-[50px]">
        <Image
          className="aspect-square rounded-lg object-cover shadow-lg bg-black/40"
          src={music.cover}
          alt={music.title}
          width={50}
          height={50}
        />
        <AnimatePresence>
          {musicSelected === music.id ? (
            <SimpleMusicCardIcon
              musicState={musicState}
              currentMusic={currentMusic}
              music={music}
            />
          ) : currentMusic?.id === music.id ? (
            <SimpleMusicCardIcon
              musicState={musicState}
              currentMusic={currentMusic}
              music={music}
            />
          ) : null}
        </AnimatePresence>
      </div>
      <div className="flex flex-col gap-0.5 text-base font-normal truncate text-start">
        <Link
          href={`/music/${music.id}`}
          title={music.title}
          className="focus:outline-none truncate pr-2.5 focus:text-purple-400 hover:text-purple-400 active:opacity-70 duration-200"
        >
          {music.title}
        </Link>
        {showArtist && (
          <div className="truncate pr-2.5">
            <Link
              key={music.artist.id}
              title={music.artist.name}
              href={`/artist/${music.artist.id}`}
              className="focus:outline-none focus:text-purple-400 hover:text-purple-400 active:opacity-70 duration-200"
            >
              {music.artist.name}
            </Link>
          </div>
        )}
      </div>
    </motion.button>
  );
}
