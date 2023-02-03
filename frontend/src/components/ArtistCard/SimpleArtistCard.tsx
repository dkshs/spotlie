import type { ArtistProps } from "@/utils/types";

import Link from "next/link";
import Image from "next/image";

import { User } from "phosphor-react";

interface SimpleArtistCardProps {
  artist: ArtistProps;
}

export function SimpleArtistCard({ artist }: SimpleArtistCardProps) {
  return (
    <Link
      href={`/artist/${artist.id}`}
      title={artist.name}
      className="flex px-4 py-2 rounded-md gap-3 hover:bg-black/30 focus:outline-none focus:bg-black/50 focus:ring-2 ring-purple-600 duration-200"
    >
      <div className="relative rounded-lg min-w-[50px] min-h-[50px] bg-black/40 hover:opacity-70 duration-300">
        {artist.image ? (
          <Image
            className="aspect-square rounded-lg object-cover shadow-lg bg-black/40 hover:opacity-70 duration-200"
            src={artist.image}
            alt={artist.name}
            width={50}
            height={50}
          />
        ) : (
          <User className="w-full h-full hover:opacity-70 duration-300" />
        )}
      </div>
      <div className="flex flex-col mt-1 text-base font-normal truncate text-start">
        <p className="truncate pr-2.5 hover:text-purple-400 active:opacity-70 capitalize duration-200">
          {artist.name}
        </p>
      </div>
    </Link>
  );
}
