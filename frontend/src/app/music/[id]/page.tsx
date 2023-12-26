import type { Metadata, ResolvingMetadata } from "next";
import type { MusicProps } from "@/utils/types";

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
import { ScrollArea, ScrollBar } from "@/components/ui/ScrollArea";
import { MusicDuration } from "./MusicDuration";
import { DataTitle } from "@/components/DataTitle";
import { MusicMenu } from "@/components/MusicMenu";

type Props = {
  params: { id: string };
};

const getMusics = cache(async () => {
  return await serverFetcher<MusicProps[]>("/musics");
});

export async function generateStaticParams() {
  const musics = await getMusics();

  return musics.map((music) => ({
    id: music.id,
  }));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = params;

  const music = (await getMusics()).find((music) => music.id === id);

  if (!music) {
    notFound();
  }

  const musicUrl = `${(await parent).metadataBase}music/`;
  const description = (await parent).description || undefined;

  return {
    metadataBase: new URL(musicUrl),
    title: music.title,
    description,
    alternates: {
      canonical: music.id,
    },
    openGraph: {
      title: music.title,
      description,
      url: music.id,
      type: "music.song",
      images: music.image && [music.image],
    },
    twitter: {
      title: music.title,
      card: music.image ? "summary_large_image" : "summary",
      images: music.image && [music.image],
      description,
    },
  };
}

export default async function MusicPage({ params }: Props) {
  let musics = await getMusics();
  const music = musics.find((music) => music.id === params.id);
  if (!music) {
    notFound();
  }
  musics = musics.filter(
    (m) => m.id !== params.id && m.artist.id === music.artist.id,
  );

  return (
    <div className="mb-20 mt-10 px-4 sm:px-9 md:mt-20">
      <div className="flex flex-col justify-center text-center md:min-h-[280px] md:flex-row md:justify-start md:text-start">
        {music.image && (
          <>
            <div className="absolute inset-0 z-[-1] bg-center md:h-80">
              <Image
                className="aspect-square bg-cover bg-center bg-no-repeat object-cover opacity-50 blur-2xl"
                src={music.image}
                alt={music.title}
                fill
              />
            </div>
            <div className="flex justify-center self-center rounded-md bg-black/50 md:mr-8 md:min-h-[280px] md:min-w-[280px]">
              <Image
                src={music.image}
                alt={music.title}
                className="aspect-square h-full w-full rounded-md object-cover shadow-xl shadow-black/40"
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
              Music
            </small>
            <DataTitle title={music.title} />
            <div className="flex items-center gap-2 self-center md:self-start">
              <div className="flex items-center gap-2 after:content-['•']">
                {music.artist?.image && (
                  <Image
                    src={music.artist.image}
                    alt={music.artist.full_name}
                    className="size-6 rounded-full bg-black/20"
                    width={24}
                    height={24}
                  />
                )}
                <Link
                  href={`/artist/${music.artist.id}`}
                  title={music.artist.full_name}
                  className="rounded-sm font-bold outline-2 outline-purple-400 duration-200 hover:underline focus:outline active:opacity-70"
                >
                  {music.artist.full_name}
                </Link>
              </div>
              {music.release_date && (
                <HoverCard openDelay={200} closeDelay={100}>
                  <HoverCardTrigger className="after:ml-1.5 after:content-['•']">
                    {new Date(music.release_date).getFullYear()}
                  </HoverCardTrigger>
                  <HoverCardContent side="top" className="w-fit px-3 py-2">
                    {new Date(music.release_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </HoverCardContent>
                </HoverCard>
              )}
              <div>
                <MusicDuration src={music.audio} />
              </div>
            </div>
          </div>
          <div className="group relative flex self-center md:mt-3 md:self-start [&_button]:relative [&_button]:translate-y-0 [&_button]:opacity-100">
            <ControlButton music={music} />
            <div className="mt-1">
              <MusicMenu music={music} showGoToMusic={false} />
            </div>
          </div>
        </div>
      </div>
      {musics && musics.length > 0 && (
        <section className="mt-20">
          <header className="flex items-center justify-between">
            <h2 className="text-xl font-bold">
              More by {music.artist.full_name}
            </h2>
          </header>
          <ScrollArea className="w-full max-w-[calc(100vw-20px)] whitespace-nowrap">
            <div className="flex w-max gap-3 px-1 pb-4 pt-3">
              {musics.map((music) => (
                <div key={music.id} className="w-full">
                  <MusicCard
                    music={music}
                    musics={musics}
                    showArtist={false}
                    text={
                      music.release_date &&
                      new Date(music.release_date).getFullYear().toString()
                    }
                  />
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>
      )}
    </div>
  );
}
