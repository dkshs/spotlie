import type { ArtistPropsWithMusics } from "@/utils/types";

import Image from "next/image";
import Link from "next/link";
import { ActionMenu } from "../ActionMenu";
import { ControlButton } from "../MusicCard";

interface VerticalArtistCardProps {
  readonly artist: ArtistPropsWithMusics;
}

function VerticalArtistCard({ artist }: VerticalArtistCardProps) {
  return (
    <div className="group relative flex h-60 w-40 snap-center flex-col items-center gap-4 rounded-lg bg-secondary/50 p-2 md:h-72 md:w-52 md:p-4">
      <Link
        href={`/artist/${artist.id}`}
        className="absolute inset-0 z-10 rounded-lg ring-ring duration-200 focus:outline-none focus:ring-2"
        aria-label={artist.full_name}
      />
      <div className="absolute inset-0 z-[-1] size-full scale-95 rounded-lg bg-secondary opacity-0 duration-300 group-focus-within:scale-100 group-focus-within:opacity-100 group-hover:scale-100 group-hover:opacity-100" />
      <div className="relative size-36 rounded-full bg-background bg-gradient-to-tr from-background/60 to-primary/20 shadow-lg shadow-background/60 md:size-44">
        {artist.image ? (
          <Image
            alt={artist.full_name}
            src={artist.image}
            className="aspect-square size-36 rounded-full object-cover md:size-44"
            fill
          />
        ) : null}
        {artist.musics?.length > 0 && (
          <ControlButton
            artistId={artist.id}
            music={artist.musics[0]!}
            musics={artist.musics}
          />
        )}
      </div>
      <div className="flex w-full flex-col items-start truncate">
        <h3 className="w-full truncate rounded-lg text-lg font-bold group-hover:underline">
          {artist.full_name}
        </h3>
        <p className="w-full truncate text-sm text-foreground/60">Artist</p>
      </div>
      <div className="absolute inset-0">
        <ActionMenu
          actionId={artist.id}
          actionType="artist"
          user={artist}
          triggerClassName="scale-100 bottom-1 right-1 m-0 hover:bg-background/60 md:bottom-2 md:right-2"
        />
      </div>
    </div>
  );
}

export { type VerticalArtistCardProps, VerticalArtistCard };
