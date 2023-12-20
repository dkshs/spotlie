import type { MusicProps, ArtistProps } from "@/utils/types";

import { serverFetcher } from "@/utils/api";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { MusicCard } from "@/components/MusicCard";
import { ArtistCard } from "@/components/ArtistCard";

export const revalidate = 60 * 5; // 5 minutes

export default async function HomePage() {
  const musics = await serverFetcher<MusicProps[]>("/musics", {
    needAuth: false,
  });
  const artists = await serverFetcher<ArtistProps[]>("/artists");

  return (
    <div className="my-8 flex flex-col gap-8">
      <section className="px-4 md:px-9">
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Musics</h2>
          <Button size="sm" radius="full" className="px-4" asChild>
            <Link href="/musics">
              <span className="text-sm font-bold uppercase">See more</span>
            </Link>
          </Button>
        </header>
        <div className="flex w-full max-w-[calc(100vw-20px)] snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-4 pt-2 md:gap-4">
          {musics.map((music) => (
            <MusicCard key={music.id} music={music} />
          ))}
        </div>
      </section>
      <section className="px-4 md:px-9">
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Artists</h2>
          <Button size="sm" radius="full" className="px-4" asChild>
            <Link href="/artists">
              <span className="text-sm font-bold uppercase">See more</span>
            </Link>
          </Button>
        </header>
        <div className="flex w-full max-w-[calc(100vw-20px)] snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-4 pt-2 md:gap-4">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>
    </div>
  );
}
