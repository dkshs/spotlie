import type { Metadata } from "next";
import type { MusicProps, PlaylistPropsWithMusics } from "@/utils/types";

import { currentUser } from "@clerk/nextjs";
import { serverFetcher } from "@/utils/api";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { MusicCard } from "@/components/MusicCard";
import { CreatePlaylist } from "./CreatePlaylist";
import { CreateMusic } from "./CreateMusic";

export const metadata: Metadata = {
  title: "Library",
};

export default async function LibraryPage() {
  const user = await currentUser();
  const publicMetadata = user?.publicMetadata;
  const externalId = (publicMetadata?.external_id as string) || null;
  const isArtist = (publicMetadata?.is_artist as boolean) || false;

  if (!externalId) return null;
  const { data: musics } = isArtist
    ? await serverFetcher<MusicProps[]>("/musics/", {
        searchParams: { artist_id: externalId, limit: "10" },
      })
    : { data: [] };
  const { data: playlists } = await serverFetcher<PlaylistPropsWithMusics[]>(
    "/playlists/",
    {
      searchParams: { object_id: externalId, limit: "10" },
      next: { revalidate: 0 },
    },
  );
  const playlistMusics =
    playlists?.flatMap((playlist) => playlist.musics) || [];

  return (
    <div className="my-8 flex flex-col gap-8">
      {playlists && (
        <section className="px-4 md:px-9">
          <header className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Playlists</h2>
            <div className="flex flex-wrap justify-end gap-1 self-end sm:gap-3">
              <CreatePlaylist />
              <Button size="sm" radius="full" className="px-4" asChild>
                <Link href="/my/playlists">
                  <span className="text-sm font-bold uppercase">See more</span>
                </Link>
              </Button>
            </div>
          </header>
          <ScrollArea className="w-full max-w-[calc(100vw-20px)] whitespace-nowrap">
            <div className="flex w-max gap-2 px-1 pb-4 pt-2 md:gap-4">
              {playlists.map(
                (playlist) =>
                  (playlist.musics.length > 0 || playlistMusics[0]) && (
                    <MusicCard
                      key={playlist.id}
                      music={playlist.musics[0]! || playlistMusics[0]}
                      playlist={playlist}
                      showArtist={false}
                      actionId={playlist.id}
                      text="Playlist"
                    />
                  ),
              )}
            </div>
          </ScrollArea>
        </section>
      )}
      {isArtist && musics && musics.length > 0 && (
        <section className="px-4 md:px-9">
          <header className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Musics</h2>
            <div className="flex flex-wrap justify-end gap-1 self-end sm:gap-3">
              <CreateMusic />
              <Button size="sm" radius="full" className="px-4" asChild>
                <Link href="/my/musics">
                  <span className="text-sm font-bold uppercase">See more</span>
                </Link>
              </Button>
            </div>
          </header>
          <ScrollArea className="w-full max-w-[calc(100vw-20px)] whitespace-nowrap">
            <div className="flex w-max gap-2 px-1 pb-4 pt-2 md:gap-4">
              {musics.map((music) => (
                <MusicCard
                  key={music.id}
                  music={music}
                  showArtist={false}
                  actionId={music.id}
                  text="Music"
                />
              ))}
            </div>
          </ScrollArea>
        </section>
      )}
    </div>
  );
}
