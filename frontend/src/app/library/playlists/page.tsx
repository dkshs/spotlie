import type { Metadata } from "next";
import type { MusicProps, PlaylistPropsWithMusics } from "@/utils/types";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { serverFetcher } from "@/utils/api";
import { createLikedMusicsPlaylist } from "@/utils/transform";
import { MusicCard } from "@/components/MusicCard";

export const metadata: Metadata = {
  title: "My Playlists",
};

export default async function MyPlaylistsPage() {
  const user = await currentUser();
  const publicMetadata = user?.publicMetadata;
  const externalId = (publicMetadata?.external_id as string) || null;
  const isArtist = (publicMetadata?.is_artist as boolean) || false;

  if (!user || !externalId || !isArtist) {
    redirect("/library");
  }
  const { data: likedMusics } = await serverFetcher<MusicProps[]>("/musics/", {
    needAuth: true,
    searchParams: {
      [isArtist ? "liked_artists" : "liked_by"]: externalId,
    },
  });
  const { data: playlists } = await serverFetcher<PlaylistPropsWithMusics[]>(
    "/playlists/",
    {
      searchParams: { object_id: externalId },
      next: { revalidate: 0 },
      needAuth: true,
    },
  );
  const playlist = likedMusics && createLikedMusicsPlaylist(likedMusics);
  if (!playlists) {
    redirect("/library");
  }

  return (
    <div className="mb-8 mt-6 px-4 lg:px-9">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">My Playlists</h1>
      </div>
      <div className="flex gap-2 flex-wrap px-1 my-4 md:gap-4">
        {playlist ? (
          <MusicCard
            key={playlist.id}
            music={playlist.musics[0]! || {}}
            href="/library/liked-musics"
            playlist={playlist}
            showArtist={false}
            actionId={playlist.id}
            text="Playlist"
          />
        ) : null}
        {playlists.map((playlist) => (
          <MusicCard
            key={playlist.id}
            music={playlist.musics[0]!}
            playlist={playlist}
            showArtist={false}
            actionId={playlist.id}
            text="Playlist"
          />
        ))}
      </div>
    </div>
  );
}
