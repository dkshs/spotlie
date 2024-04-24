import type { ArtistPropsWithMusics, MusicProps } from "@/utils/types";

import Link from "next/link";
import { serverFetcher } from "@/utils/api";

import { Button } from "@/components/ui/Button";
import { ScrollArea, ScrollBar } from "@/components/ui/ScrollArea";
import { MusicCard } from "@/components/MusicCard";
import { ArtistCard } from "@/components/ArtistCard";

export const revalidate = 60 * 5; // 5 minutes

export default async function HomePage() {
  const searchParams = { limit: "10" };
  const { data: musics } = await serverFetcher<MusicProps[]>("/musics/", {
    searchParams,
  });
  const { data: artists } = await serverFetcher<ArtistPropsWithMusics[]>(
    "/artists/",
    { searchParams },
  );

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
        <ScrollArea className="w-full max-w-[calc(100vw-20px)] whitespace-nowrap">
          <div className="flex w-max gap-2 px-1 pb-4 pt-2 md:gap-4">
            {musics ? (
              musics.map((music) => (
                <MusicCard
                  key={music.id}
                  music={music}
                  musics={musics}
                  actionId={music.id}
                />
              ))
            ) : (
              <p>No musics found...</p>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
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
        <ScrollArea className="w-full max-w-[calc(100vw-20px)] whitespace-nowrap">
          <div className="flex w-max gap-2 px-1 pb-4 pt-2 md:gap-4">
            {artists ? (
              artists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))
            ) : (
              <p>No artists found...</p>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>
    </div>
  );
}
