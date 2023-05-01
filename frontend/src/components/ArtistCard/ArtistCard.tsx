import type { ArtistProps } from "@/utils/types";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { User } from "@phosphor-icons/react";

interface ArtistCardProps {
  artist: ArtistProps;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  const MotionLink = motion(Link);

  return (
    <motion.div
      key={artist.id}
      className="py-1 max-w-[178px] snap-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <MotionLink
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02, opacity: 0.7 }}
        whileFocus={{ scale: 1.02, opacity: 0.7 }}
        transition={{ duration: 0.3 }}
        href={`/artist/${artist.id}`}
        title={artist.name}
        className="relative rounded-lg overflow-hidden block min-h-[178px] min-w-[178px] bg-black/40 outline-none focus:ring ring-purple-600"
      >
        {artist.image ? (
          <Image
            className="aspect-square object-cover shadow-xl shadow-black/60 bg-black/20 duration-300"
            src={artist.image}
            alt={artist.name}
            width={178}
            height={178}
            priority
          />
        ) : (
          <User className="w-full h-full duration-300" />
        )}
      </MotionLink>
      <div className="flex flex-col mt-2 gap-0.5 text-base font-normal truncate">
        <Link
          href={`/artist/${artist.id}`}
          title={artist.name}
          className="truncate pr-2.5 focus:text-purple-400 hover:text-purple-400 active:opacity-70 duration-200"
        >
          {artist.name}
        </Link>
      </div>
    </motion.div>
  );
}
