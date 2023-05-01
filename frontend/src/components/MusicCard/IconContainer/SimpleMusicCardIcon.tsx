import Image from "next/image";
import { motion } from "framer-motion";

import type { MusicCardIconProps } from "./types";

import { Pause, Play } from "@phosphor-icons/react";

export function SimpleMusicCardIcon({
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
        className="rounded-full"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        whileHover={{ scale: 1.2 }}
      >
        {musicState === "playing" && currentMusic?.id === music.id ? (
          <>
            <Image
              src="/musicPlaying.gif"
              alt="Música tocando"
              className="flex group-hover:hidden group-focus:hidden"
              height={24}
              width={24}
            />
            <Pause
              size={24}
              weight="fill"
              className="hidden hover:text-purple-400 group-hover:flex group-focus:flex duration-300"
            />
          </>
        ) : (
          <Play
            size={24}
            weight="fill"
            className="hover:text-purple-400 duration-300"
          />
        )}
      </motion.div>
    </motion.div>
  );
}
