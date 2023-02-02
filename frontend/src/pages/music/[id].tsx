import { useState } from "react";
import { useMusic } from "@/hooks/useMusic";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { api } from "@/lib/axios";
import { musicTimeFormatter } from "@/utils/formatter";

import type { MusicProps } from "@/utils/types";

import { Meta } from "@/components/Meta";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { Pause, Play, User } from "phosphor-react";

export default function MusicPage() {
  const { playMusic, pauseMusic, musicState, currentMusic } = useMusic();
  const router = useRouter();
  const [musicDuration, setMusicDuration] = useState("");

  const { id } = router.query;

  const {
    data: music,
    isFetching,
    isLoading,
  } = useQuery<MusicProps | null>({
    queryKey: [`music-${id}`],
    queryFn: async () => {
      if (!id) return null;
      try {
        const { data } = await api.get<MusicProps>(`/music/${id}`);
        if (data) {
          const audio = new Audio(data.audio);
          audio.onloadedmetadata = () => {
            setMusicDuration(musicTimeFormatter(audio).musicDurationTime);
          };
        }
        return data;
      } catch (error) {
        return null;
      }
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div className="px-4 sm:px-9 mt-20">
      {isFetching || isLoading ? (
        <div className="flex flex-col justify-center text-center md:justify-start md:text-start md:flex-row md:min-h-[280px]">
          <div className="self-center md:mr-8 md:min-h-[280px] flex justify-center animate-pulse">
            <div className="min-w-[280px] min-h-[280px] object-cover aspect-square bg-black/30" />
          </div>
          <div className="flex flex-col justify-evenly md:justify-around gap-2 min-h-[280px] w-full">
            <div className="flex flex-col gap-2">
              <small className="font-extrabold text-xs md:mt-4 uppercase text-purple-600">
                Música
              </small>
              <span className="md:mb-3 h-9 bg-black/30 inline-block w-1/3 rounded-md" />
              <div className="flex gap-2 items-center self-center md:self-start md:mb-2 w-full">
                <div className="flex items-center gap-2 w-full">
                  <div className="rounded-full w-[24px] h-[24px] bg-black/30" />
                  <span className="h-6 rounded-md bg-black/30 w-1/5 inline-block" />
                </div>
              </div>
            </div>
            <div className="self-center md:self-start">
              <div className="bg-black/30 p-3 animate-pulse flex items-center bg-purple-700 rounded-full hover:bg-purple-600 hover:scale-105 active:opacity-70 active:scale-100 duration-300">
                <Play size={24} weight="fill" />
              </div>
            </div>
          </div>
        </div>
      ) : music && music.singers ? (
        <div className="flex flex-col justify-center text-center md:justify-start md:text-start md:flex-row md:min-h-[280px]">
          <div
            className="absolute bg-cover inset-0 bg-center bg-no-repeat md:h-96 z-[-1] blur-3xl opacity-50"
            style={{ backgroundImage: `url(${music.cover})` }}
          ></div>
          <Meta title={music.title} path={`/music/${id}`} />
          <div className="self-center md:mr-8 rounded-md bg-black/50 md:min-h-[280px] flex justify-center">
            <Image
              src={music.cover}
              alt={music.title}
              className="shadow-xl rounded-md shadow-black/40 object-cover aspect-square"
              width={280}
              height={280}
              priority
            />
          </div>
          <div className="flex flex-col justify-evenly md:justify-around gap-2 min-h-[280px]">
            <div className="flex flex-col gap-2">
              <small className="font-extrabold text-xs md:mt-4 uppercase text-white">
                Música
              </small>
              <h1 className="font-extrabold font-sans text-3xl break-words md:mb-3">
                {music.title}
              </h1>
              <div className="flex gap-2 items-center self-center md:self-start md:mb-2">
                <div className="flex items-center gap-2">
                  {music.singers[0].image ? (
                    <Image
                      src={music.singers[0].image}
                      alt={music.singers[0].name}
                      className="bg-black/20 rounded-full w-6 h-6"
                      width={24}
                      height={24}
                    />
                  ) : (
                    <User
                      weight="bold"
                      size={24}
                      className="bg-black/20 rounded-full"
                    />
                  )}
                  <Link
                    href={`/singer/${music.singers[0].id}`}
                    title={music.singers[0].name}
                    className="hover:text-purple-400 focus:outline outline-2 rounded-sm outline-purple-400 active:opacity-70 duration-200"
                  >
                    {music.singers[0].name}
                  </Link>
                  <span className="before:content-['•'] before:mr-1.5">
                    {musicDuration}
                  </span>
                </div>
              </div>
            </div>
            <div className="self-center md:self-start">
              <button
                type="button"
                title={`${
                  musicState === "playing" && currentMusic?.id === music.id
                    ? "Pausar"
                    : "Reproduzir"
                } ${music.title}`}
                onClick={() =>
                  musicState === "playing" && currentMusic?.id === music.id
                    ? pauseMusic()
                    : playMusic(music)
                }
                className="flex items-center p-3 bg-purple-700 rounded-full hover:bg-purple-600 shadow-md hover:shadow-purple-800/50 hover:scale-105 active:opacity-70 active:scale-100 focus:outline-none focus:ring-2 ring-purple-400 ring-offset-black ring-offset-2 duration-300"
              >
                {musicState === "playing" && currentMusic?.id === music.id ? (
                  <Pause size={24} weight="fill" />
                ) : (
                  <Play size={24} weight="fill" />
                )}
              </button>
            </div>
          </div>
          <div className="px-9 mt-8"></div>
        </div>
      ) : (
        <div className="flex flex-col justify-center text-center md:justify-start md:text-start md:flex-row md:min-h-[280px]">
          <Head>
            <title>
              Não foi possível encontrar a música que você está procurando.
            </title>
          </Head>
          <section className="flex text-center flex-col w-full">
            <h1 className="text-2xl pt-10 mb-2">
              Não foi possível encontrar a música que você está procurando.
            </h1>
            <p className="text-lg mt-2">
              Por favor, volte para a{" "}
              <Link
                href="/"
                className="text-blue-300 hover:text-blue-200 hover:underline underline-offset-2 active:opacity-70"
              >
                página inicial do Spotify Zero
              </Link>
              .
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
