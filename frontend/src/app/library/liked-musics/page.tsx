import type { Metadata } from "next";
import type { MusicProps, UserProps } from "@/utils/types";

import { redirect } from "next/navigation";
import { PlaylistPage as PlaylistPageComp } from "@/components/PlaylistPage";
import { serverFetcher } from "@/utils/api";
import { createLikedMusicsPlaylist } from "@/utils/transform";

export const metadata: Metadata = {
  title: "Liked Musics",
};

export default async function LikedMusicsPage() {
  const { data: user } = await serverFetcher<UserProps>("/users/me/", {
    next: { revalidate: 0 },
    needAuth: true,
    throwError: false,
  });
  const { data: likeMusics } = await serverFetcher<MusicProps[]>(
    "/musics/liked",
    {
      next: { revalidate: 0 },
      needAuth: true,
      throwError: false,
    },
  );
  const playlist =
    likeMusics && createLikedMusicsPlaylist(likeMusics, user || undefined);

  if (!playlist) {
    redirect("/library");
  }
  return <PlaylistPageComp playlist={playlist} isStatic />;
}
