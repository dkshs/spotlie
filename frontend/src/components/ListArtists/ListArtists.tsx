import type { ArtistProps } from "@/utils/types";

import Link from "next/link";
import { ArtistCard } from "../ArtistCard";

interface ListArtistsProps {
  artists?: ArtistProps[];
  isFetching?: boolean;
}

export function ListArtists({ artists, isFetching }: ListArtistsProps) {
  const skeletonItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <section className="px-9 mt-8">
      <header className="flex justify-between mb-4 items-center">
        <h1 className="font-bold text-xl">Artistas</h1>
        <Link
          href="/artists"
          title="Ver mais artistas"
          className="bg-purple-800 py-1.5 px-4 rounded-3xl hover:scale-105 hover:bg-purple-600 focus:outline-none focus:ring-2 ring-purple-300 active:bg-purple-600/20 duration-200"
        >
          <span className="uppercase text-sm font-bold">Ver mais</span>
        </Link>
      </header>
      <div className="px-1 pb-3 flex flex-1 gap-8 overflow-x-auto w-[calc(100% - 20px)] snap-x snap-mandatory">
        {!artists || isFetching
          ? skeletonItems.map((i) => (
              <div
                key={i}
                className="py-1 max-w-[178px] snap-center min-h-[206px]"
              >
                <div className="rounded-lg overflow-hidden block min-h-[178px] min-w-[178px]">
                  <div className="aspect-square bg-black/20 animate-pulse" />
                </div>
                <div className="flex flex-col mt-2 gap-0.5 text-base font-normal truncate">
                  <span className="h-6 w-1/2 bg-black/20 animate-pulse" />
                </div>
              </div>
            ))
          : artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
      </div>
    </section>
  );
}