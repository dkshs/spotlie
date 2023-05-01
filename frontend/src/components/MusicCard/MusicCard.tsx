import { Dispatch, SetStateAction, useEffect } from "react";
import { useMusic } from "@/hooks/useMusic";
import type { MusicProps } from "@/utils/types";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { MusicCardIcon } from "./IconContainer";

interface MusicCardProps {
  music: MusicProps;
  playlist?: MusicProps[];
  musicSelected?: string | null;
  setMusicSelected?: Dispatch<SetStateAction<string | null>>;
}

export function MusicCard({
  music,
  playlist,
  musicSelected,
  setMusicSelected,
}: MusicCardProps) {
  const { playMusic, musicState, currentMusic, pauseMusic } = useMusic();

  useEffect(() => {
    setMusicSelected && setMusicSelected(currentMusic?.id || null);
  }, [currentMusic?.id, setMusicSelected]);

  return (
    <motion.div
      className="py-1 max-w-[178px] snap-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
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
        onClick={() =>
          musicState === "playing" && music.id === currentMusic?.id
            ? pauseMusic()
            : playMusic(music, playlist)
        }
        className="relative rounded-lg overflow-hidden block min-h-[178px] min-w-[178px] group outline-none focus-visible:ring ring-purple-600 duration-200"
      >
        <Image
          className="aspect-square object-cover shadow-xl shadow-black/60 bg-black/20"
          src={music.cover}
          alt={music.title}
          width={178}
          height={178}
          priority
        />
        <AnimatePresence>
          {musicSelected === music.id ? (
            <MusicCardIcon
              musicState={musicState}
              currentMusic={currentMusic}
              music={music}
            />
          ) : currentMusic?.id === music.id ? (
            <MusicCardIcon
              musicState={musicState}
              currentMusic={currentMusic}
              music={music}
            />
          ) : null}
        </AnimatePresence>
      </motion.button>
      <div className="flex flex-col mt-2 gap-0.5 text-base font-normal truncate">
        <Link
          href={`/music/${music.id}`}
          title={music.title}
          className="truncate pr-2.5 focus:text-purple-400 hover:text-purple-400 active:opacity-70 duration-200 focus:outline-none"
        >
          {music.title}
        </Link>
        <div className="truncate pr-2.5">
          <Link
            key={music.artist.id}
            title={music.artist.name}
            href={`/artist/${music.artist.id}`}
            className="focus:text-purple-400 hover:text-purple-400 active:opacity-70 duration-200 focus:outline-none"
          >
            {music.artist.name}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
