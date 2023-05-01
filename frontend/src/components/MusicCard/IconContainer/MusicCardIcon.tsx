import Image from "next/image";
import { motion } from "framer-motion";

import type { MusicCardIconProps } from "../types";

import { Pause, Play } from "@phosphor-icons/react";

export function MusicCardIcon({
  currentMusic,
  musicState,
  music,
}: MusicCardIconProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute justify-center items-center inset-0 flex bg-black/50"
    >
      <motion.div
        className="p-3 bg-purple-600/40 backdrop-blur-sm rounded-full"
        initial={{ scale: 0, rotate: 180 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 180 }}
        transition={{ duration: 0.2 }}
        whileHover={{ scale: 1.1 }}
      >
        {musicState === "playing" && currentMusic?.id === music.id ? (
          <>
            <Image
              src="/musicPlaying.gif"
              alt="Música tocando"
              className="flex group-hover:hidden group-focus:hidden"
              height={32}
              width={32}
            />
            <Pause
              size={32}
              weight="fill"
              className="hidden group-hover:flex group-focus:flex"
            />
          </>
        ) : (
          <Play size={32} weight="fill" />
        )}
      </motion.div>
    </motion.div>
  );
}
