import type { Metadata, ResolvingMetadata } from "next";
import type {
  ArtistPropsWithMusics,
  PlaylistPropsWithMusics,
} from "@/utils/types";

import { cache } from "react";
import { notFound } from "next/navigation";
import { serverFetcher } from "@/utils/api";

import Image from "next/image";
import { ControlButton, MusicCard } from "@/components/MusicCard";
import { ScrollArea, ScrollBar } from "@/components/ui/ScrollArea";
import { DataTitle } from "@/components/DataTitle";
import { ActionMenu } from "@/components/ActionMenu";

type Props = {
  params: { id: string };
};

const getArtists = cache(async () => {
  const res = await serverFetcher<ArtistPropsWithMusics[]>("/artists/");
  return res.data || [];
});

export async function generateStaticParams() {
  const artists = await getArtists();

  return artists.map((artist) => ({
    id: artist.id,
  }));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = params;

  const artist = (await getArtists()).find((artist) => artist.id === id);

  if (!artist) {
    notFound();
  }

  const artistUrl = `${(await parent).metadataBase}artist/`;
  const description = artist.about || (await parent).description || undefined;

  return {
    metadataBase: new URL(artistUrl),
    title: artist.full_name,
    description,
    alternates: {
      canonical: artist.id,
    },
    openGraph: {
      title: artist.full_name,
      description,
      url: artist.id,
      type: "profile",
      images: artist.image && [artist.image],
    },
    twitter: {
      title: artist.full_name,
      card: artist.image ? "summary_large_image" : "summary",
      images: artist.image && [artist.image],
      description,
    },
  };
}

export default async function ArtistPage({ params }: Props) {
  const artist = (await getArtists()).find((artist) => artist.id === params.id);
  if (!artist) {
    notFound();
  }
  const { data: playlists } = await serverFetcher<PlaylistPropsWithMusics[]>(
    "/playlists/",
    { searchParams: { object_id: artist.id }, next: { revalidate: 0 } },
  );
  const musics = playlists?.map((playlist) => playlist.musics) || [];

  return (
    <div className="mb-20 mt-10 px-4 sm:px-9 md:mt-20">
      <div className="flex flex-col justify-center text-center md:min-h-[280px] md:flex-row md:justify-start md:text-start">
        {artist.image && (
          <div className="absolute inset-0 z-[-1] bg-center md:h-80">
            <Image
              src={artist.image}
              alt={artist.full_name}
              fill
              sizes="100vw"
              className="aspect-video bg-cover bg-center bg-no-repeat object-cover opacity-50 blur-3xl"
            />
          </div>
        )}
        {artist.image && (
          <div className="flex justify-center self-center rounded-full bg-background/50 md:mr-8 md:max-h-[280px] md:max-w-[280px]">
            <Image
              src={artist.image}
              alt={artist.full_name}
              className="aspect-square size-[280px] rounded-full object-cover shadow-xl shadow-background/40"
              width={280}
              height={280}
              priority
            />
          </div>
        )}
        <div className="mt-12 flex flex-col gap-2 md:mt-auto md:min-h-[280px] md:pt-12">
          <div className="flex flex-col gap-2">
            <small className="text-xs font-extrabold uppercase text-white md:mt-4">
              ARTIST
            </small>
            <DataTitle title={artist.full_name} />
            <div className="group relative mt-2 flex gap-3 self-center md:mt-10 md:self-start [&_button]:relative [&_button]:mr-0 [&_button]:translate-y-0 [&_button]:opacity-100">
              {artist.musics && artist.musics.length > 0 && (
                <ControlButton
                  music={artist.musics[0]!}
                  playlist={artist.musics}
                  artistId={artist.id}
                />
              )}
              <div className="mt-1">
                <ActionMenu
                  actionId={artist.id}
                  actionType="artist"
                  user={artist}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="mt-14 md:px-9">
        <header className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Musics</h2>
        </header>
        <div className="grid grid-cols-1 gap-1 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          {artist.musics && artist.musics.length > 0 ? (
            artist.musics.map((music) => (
              <div key={music.id} className="w-full">
                <MusicCard
                  music={music}
                  musics={artist.musics}
                  showArtist={false}
                  orientation="horizontal"
                  actionId={music.id}
                  showGoToArtist={false}
                />
              </div>
            ))
          ) : (
            <p>The artist {artist.full_name} has no songs!</p>
          )}
        </div>
      </section>
      {playlists && playlists.length > 0 && (
        <section className="mt-14 md:px-9">
          <header className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Artist Playlists</h2>
          </header>
          <ScrollArea className="w-full max-w-[calc(100vw-20px)] whitespace-nowrap">
            <div className="flex w-max gap-3 px-1 pb-4 pt-3">
              {playlists.map(
                (playlist) =>
                  (playlist.musics.length > 0 || musics[0]) && (
                    <MusicCard
                      key={playlist.id}
                      music={playlist.musics[0]! || musics[0]}
                      playlist={playlist}
                      showArtist={false}
                      actionId={playlist.id}
                      text={`By ${artist.full_name}`}
                    />
                  ),
              )}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>
      )}
    </div>
  );
}
