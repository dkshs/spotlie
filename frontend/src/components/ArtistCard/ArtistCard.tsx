import type { ArtistProps } from "@/utils/types";

import Image from "next/image";
import Link from "next/link";

interface ArtistCardProps {
  artist: ArtistProps;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Link
      href={`/artist/${artist.id}`}
      className="group relative flex h-60 w-40 cursor-pointer snap-center flex-col items-center gap-4 rounded-lg bg-secondary/40 p-2 ring-ring duration-200 hover:bg-secondary focus:bg-secondary focus:outline-none focus:ring-2 md:h-72 md:w-52 md:p-4"
    >
      <div className="relative h-[65%] min-h-[65%] w-36 overflow-hidden rounded-lg bg-background bg-gradient-to-tr from-background/60 to-primary/20 shadow-lg shadow-background/60 md:w-44">
        {artist.image && (
          <Image
            alt={artist.username}
            src={artist.image}
            className="aspect-square object-cover"
            fill
          />
        )}
      </div>
      <h3 className="w-full truncate rounded-lg text-lg font-bold outline-ring hover:underline focus-visible:outline">
        {artist.username}
      </h3>
    </Link>
  );
}
