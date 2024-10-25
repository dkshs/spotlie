import type { Metadata, ResolvingMetadata } from "next";
import type { PlaylistPropsWithMusics } from "@/utils/types";

import { cache } from "react";
import { notFound } from "next/navigation";
import { PlaylistPage as PlaylistPageComp } from "@/components/PlaylistPage";
import { serverFetcher } from "@/utils/api";

type Props = {
  readonly params: Promise<{ id: string }>;
};

const getPlaylist = cache(async (id: string) => {
  try {
    const { data } = await serverFetcher<PlaylistPropsWithMusics>(
      `/playlists/${id}`,
      { next: { revalidate: 0 }, needAuth: true },
    );
    if (!data) throw new Error("Playlist not found");
    return data;
  } catch {
    notFound();
  }
});

export async function generateStaticParams() {
  const { data: playlists } = await serverFetcher<PlaylistPropsWithMusics[]>(
    "/playlists/",
    { next: { revalidate: 0 }, throwError: false },
  );

  return (playlists || []).map((playlist) => ({
    id: playlist.id,
  }));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const playlist = await getPlaylist((await params).id);

  const playlistUrl = `${(await parent).metadataBase}playlist/`;
  const description =
    playlist.description || (await parent).description || undefined;

  return {
    metadataBase: new URL(playlistUrl),
    title: playlist.name,
    description,
    alternates: {
      canonical: playlist.id,
    },
    openGraph: {
      title: playlist.name,
      description,
      url: playlist.id,
      type: "music.playlist",
      images: playlist.image && [playlist.image],
    },
    twitter: {
      title: playlist.name,
      card: playlist.image ? "summary_large_image" : "summary",
      images: playlist.image && [playlist.image],
      description,
    },
  };
}

export default async function PlaylistPage({ params }: Props) {
  const playlist = await getPlaylist((await params).id);

  return <PlaylistPageComp playlist={playlist} />;
}
