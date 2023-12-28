import type { Metadata, ResolvingMetadata } from "next";
import type { MusicProps, PlaylistPropsWithMusics } from "@/utils/types";

import { cache } from "react";
import { notFound } from "next/navigation";
import { serverFetcher } from "@/utils/api";

import Image from "next/image";
import Link from "next/link";
import { ControlButton, MusicCard } from "@/components/MusicCard";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/HoverCard";
import { DataTitle } from "@/components/DataTitle";
import { ActionMenu } from "@/components/ActionMenu";

type Props = {
  params: { id: string };
};

const getPlaylists = cache(async () => {
  const res = await serverFetcher<PlaylistPropsWithMusics[]>("/playlists/", {
    next: { revalidate: 0 },
  });
  return res.data || [];
});

export async function generateStaticParams() {
  const playlists = await getPlaylists();

  return playlists.map((playlist) => ({
    id: playlist.id,
  }));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = params;

  const playlist = (await getPlaylists()).find(
    (playlist) => playlist.id === id,
  );

  if (!playlist) {
    notFound();
  }

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
  const playlist = (await getPlaylists()).find(
    (playlist) => playlist.id === params.id,
  );
  if (!playlist) {
    notFound();
  }
  const orderIds = [
    ...new Set(playlist.musics?.flatMap((m) => m.order_id).sort()),
  ];
  const musics = playlist.musics
    ? orderIds.map((orderId) => {
        return {
          ...(playlist.musics.find((m) =>
            m.order_id.includes(orderId),
          ) as MusicProps),
          order_id: orderId,
        };
      })
    : [];

  return (
    <div className="mb-20 mt-10 px-4 sm:px-9 md:mt-20">
      <div className="flex flex-col justify-center text-center md:min-h-[280px] md:flex-row md:justify-start md:text-start">
        {(playlist.image || playlist.musics[0]?.image) && (
          <>
            <div className="absolute inset-0 z-[-1] bg-center md:h-80">
              <Image
                className="aspect-square bg-cover bg-center bg-no-repeat object-cover opacity-50 blur-2xl"
                src={(playlist.image || playlist.musics[0]?.image)!}
                alt={playlist.name}
                fill
              />
            </div>
            <div className="flex justify-center self-center rounded-md bg-black/50 md:mr-8 md:max-h-[280px] md:max-w-[280px]">
              <Image
                src={(playlist.image || playlist.musics[0]?.image)!}
                alt={playlist.name}
                className="aspect-square size-[280px] rounded-md object-cover shadow-xl shadow-black/40"
                width={280}
                height={280}
                priority
              />
            </div>
          </>
        )}
        <div className="flex min-h-[280px] flex-col justify-evenly gap-2 md:justify-around">
          <div className="flex flex-col gap-2">
            <small className="text-xs font-extrabold uppercase text-white md:mt-4">
              Playlist
            </small>
            <DataTitle title={playlist.name} />
            <div className="flex items-center gap-2 self-center md:self-start">
              <div className="flex items-center gap-2 after:content-['•']">
                {playlist.owner?.image && (
                  <Image
                    src={playlist.owner.image}
                    alt={playlist.owner.full_name}
                    className="size-6 rounded-full bg-black/20"
                    width={24}
                    height={24}
                  />
                )}
                <Link
                  href={`/${playlist.owner_is_artist ? "artist" : "user"}/${
                    playlist.owner.id
                  }`}
                  title={playlist.owner.full_name}
                  className="rounded-sm font-bold outline-2 outline-purple-400 duration-200 hover:underline focus:outline active:opacity-70"
                >
                  {playlist.owner.full_name}
                </Link>
              </div>
              <HoverCard openDelay={200} closeDelay={100}>
                <HoverCardTrigger>
                  {new Date(playlist.created_at).getFullYear()}
                </HoverCardTrigger>
                <HoverCardContent side="top" className="w-fit px-3 py-2">
                  {new Date(playlist.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </HoverCardContent>
              </HoverCard>
              {playlist.musics && (
                <div className="before:mr-1.5 before:content-['•']">
                  {playlist.musics.length} musics
                </div>
              )}
            </div>
          </div>
          <div className="group relative flex self-center md:mt-3 md:self-start [&_button]:relative [&_button]:translate-y-0 [&_button]:opacity-100">
            {playlist.musics && playlist.musics.length > 0 && (
              <ControlButton
                music={playlist.musics[0]!}
                playlist={playlist.musics}
              />
            )}
            <div className="mt-1">
              <ActionMenu
                playlist={playlist}
                actionId={playlist.id}
                actionType="playlist"
              />
            </div>
          </div>
        </div>
      </div>
      {musics && musics.length > 0 && (
        <div className="mt-20 flex w-full flex-col gap-2 lg:max-w-[50%]">
          {musics.map(
            (music, i) =>
              music && (
                <div key={i} className="w-full">
                  <MusicCard
                    music={music}
                    musics={playlist.musics}
                    orientation="horizontal"
                    actionId={music.id}
                    playlist={playlist}
                    orderId={music.order_id}
                  />
                </div>
              ),
          )}
        </div>
      )}
    </div>
  );
}
