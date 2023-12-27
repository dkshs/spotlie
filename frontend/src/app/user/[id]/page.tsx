import type { Metadata, ResolvingMetadata } from "next";
import type { UserProps, PlaylistPropsWithMusics } from "@/utils/types";

import { cache } from "react";
import { notFound } from "next/navigation";
import { serverFetcher } from "@/utils/api";

import Image from "next/image";
import { MusicCard } from "@/components/MusicCard";
import { ScrollArea, ScrollBar } from "@/components/ui/ScrollArea";
import { DataTitle } from "@/components/DataTitle";
import { ActionMenu } from "@/components/ActionMenu";

type Props = {
  params: { id: string };
};

const getUsers = cache(async () => {
  return await serverFetcher<UserProps[]>("/users/");
});

export async function generateStaticParams() {
  const users = await getUsers();

  return users.map((user) => ({
    id: user.id,
  }));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = params;

  const user = (await getUsers()).find((user) => user.id === id);

  if (!user) {
    notFound();
  }

  const userUrl = `${(await parent).metadataBase}user/`;
  const description = (await parent).description || undefined;

  return {
    metadataBase: new URL(userUrl),
    title: user.full_name,
    description,
    alternates: {
      canonical: user.id,
    },
    openGraph: {
      title: user.full_name,
      description,
      url: user.id,
      type: "profile",
      images: user.image && [user.image],
    },
    twitter: {
      title: user.full_name,
      card: user.image ? "summary_large_image" : "summary",
      images: user.image && [user.image],
      description,
    },
  };
}

export default async function UserPage({ params }: Props) {
  const user = (await getUsers()).find((user) => user.id === params.id);
  if (!user) {
    notFound();
  }
  const playlists = await serverFetcher<PlaylistPropsWithMusics[]>(
    "/playlists/",
    { searchParams: { object_id: user.id } },
  );
  const musics = playlists.map((playlist) => playlist.musics);

  return (
    <div className="mb-20 mt-10 px-4 sm:px-9 md:mt-20">
      <div className="flex flex-col justify-center text-center md:min-h-[280px] md:flex-row md:justify-start md:text-start">
        {user.image && (
          <div className="absolute inset-0 z-[-1] bg-center md:h-80">
            <Image
              src={user.image}
              alt={user.full_name}
              fill
              sizes="100vw"
              className="aspect-video bg-cover bg-center bg-no-repeat object-cover opacity-50 blur-3xl"
            />
          </div>
        )}
        {user.image && (
          <div className="flex justify-center self-center rounded-full bg-background/50 md:mr-8 md:max-h-[280px] md:max-w-[280px]">
            <Image
              src={user.image}
              alt={user.full_name}
              className="aspect-square size-[280px] rounded-full object-cover shadow-xl shadow-background/40"
              width={280}
              height={280}
              priority
            />
          </div>
        )}
        <div className="mt-12 flex flex-col gap-2 md:mt-auto md:min-h-[280px] md:pt-12">
          <div className="flex flex-col gap-4">
            <small className="text-xs font-extrabold uppercase text-white md:mt-4">
              Profile
            </small>
            <DataTitle title={user.full_name} />
            {playlists?.length > 0 && (
              <div className="flex items-center gap-2 self-center md:self-start">
                <span className="text-sm">
                  {playlists.length} Public Playlists
                </span>
              </div>
            )}
          </div>
          <div className="group relative flex self-center md:mt-3 md:self-start">
            <ActionMenu
              actionId={user.id}
              actionType="user"
              triggerClassName="relative opacity-100 scale-100"
            />
          </div>
        </div>
      </div>
      {playlists && playlists.length > 0 && (
        <section className="mt-14 md:px-9">
          <header className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Public Playlists</h2>
          </header>
          <ScrollArea className="w-full max-w-[calc(100vw-20px)] whitespace-nowrap">
            <div className="flex w-max gap-3 px-1 pb-4 pt-3">
              {playlists.map(
                (playlist) =>
                  (playlist?.musics?.length > 0 || musics[0]) && (
                    <MusicCard
                      key={playlist.id}
                      music={playlist.musics[0]! || musics[0]}
                      playlist={playlist}
                      showArtist={false}
                      actionId={playlist.id}
                      text={`By ${user.full_name}`}
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
