import type { ArtistPropsWithMusics } from "@/utils/types";

import Image from "next/image";
import Link from "next/link";
import { ControlButton } from "../MusicCard";

interface VerticalArtistCardProps {
  artist: ArtistPropsWithMusics;
}

function VerticalArtistCard({ artist }: VerticalArtistCardProps) {
  return (
    <div className="group relative flex h-60 w-40 snap-center flex-col items-center gap-4 rounded-lg bg-secondary/50 p-2 md:h-72 md:w-52 md:p-4">
      <Link
        href={`/artist/${artist.id}`}
        className="absolute inset-0 z-10 rounded-lg ring-ring duration-200 focus:outline-none focus:ring-2"
        aria-label={artist.username}
      />
      <div className="absolute inset-0 z-[-1] size-full scale-95 rounded-lg bg-secondary opacity-0 duration-300 group-focus-within:scale-100 group-focus-within:opacity-100 group-hover:scale-100 group-hover:opacity-100" />
      <div className="relative size-36 rounded-full bg-background bg-gradient-to-tr from-background/60 to-primary/20 shadow-lg shadow-background/60 md:size-44">
        {artist.image && (
          <Image
            alt={artist.username}
            src={artist.image}
            className="aspect-square size-36 rounded-full object-cover md:size-44"
            fill
          />
        )}
        {artist.musics.length > 0 && (
          <ControlButton
            artistId={artist.id}
            music={artist.musics[0]!}
            playlist={artist.musics}
          />
        )}
      </div>
      <div className="flex w-full flex-col items-start truncate">
        <h3 className="w-full truncate rounded-lg text-lg font-bold group-hover:underline">
          {artist.username}
        </h3>
        <p className="w-full truncate text-sm text-foreground/60">Artist</p>
      </div>
    </div>
  );
}

export { VerticalArtistCard, type VerticalArtistCardProps };
