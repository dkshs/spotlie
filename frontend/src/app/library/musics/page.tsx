import type { Metadata } from "next";
import type { ArtistPropsWithMusics } from "@/utils/types";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { MusicCard } from "@/components/MusicCard";
import { serverFetcher } from "@/utils/api";

export const metadata: Metadata = {
  title: "My Musics",
};

export default async function MyMusicsPage() {
  const user = await currentUser();
  const publicMetadata = user?.publicMetadata;
  const externalId = (publicMetadata?.external_id as string) || null;
  const isArtist = (publicMetadata?.is_artist as boolean) || false;

  if (!user || !externalId || !isArtist) {
    redirect("/library");
  }
  const { data: artist } = await serverFetcher<ArtistPropsWithMusics>(
    `/artists/${externalId}`,
    { throwError: false },
  );
  if (!artist) {
    redirect("/library");
  }

  return (
    <div className="mb-8 mt-6 px-4 lg:px-9">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Musics</h1>
      </div>
      <div className="flex flex-col">
        <div className="grid grid-cols-1 gap-1 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          {artist.musics.map((music) => (
            <MusicCard
              key={music.id}
              music={music}
              musics={artist.musics}
              actionId={music.id}
              orientation="horizontal"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
