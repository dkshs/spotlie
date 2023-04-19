import { useEffect, useState } from "react";
import { useMusic } from "@/hooks/useMusic";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { musicTimeFormatter } from "@/utils/formatters";

import type { MusicProps } from "@/utils/types";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Meta } from "@/components/Meta";

import { Pause, Play, User } from "@phosphor-icons/react";

export default function MusicPage() {
  const { playMusic, pauseMusic, musicState, currentMusic } = useMusic();
  const [musicDuration, setMusicDuration] = useState("");
  const {
    query: { id },
  } = useRouter();

  const {
    data: music,
    isFetching,
    isLoading,
  } = useQuery<MusicProps | null>({
    queryKey: [`music-${id}`],
    queryFn: async () => {
      try {
        const { data } = await api.get(`/music/${id}`);
        return data || null;
      } catch (err) {
        console.error(err);
        return null;
      }
    },
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (music) {
      const audio = new Audio(music.audio);
      audio.onloadedmetadata = () => {
        const duration = musicTimeFormatter(audio).musicDurationTime;
        setMusicDuration(duration);
      };
    }
  }, [id, music]);

  return (
    <div className="px-4 sm:px-9 mt-10 md:mt-20">
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
      ) : music ? (
        <div className="flex flex-col justify-center text-center md:justify-start md:text-start md:flex-row md:min-h-[280px]">
          <div
            className="absolute bg-cover inset-0 bg-center bg-no-repeat md:h-80 z-[-1] blur-3xl opacity-50"
            style={{ backgroundImage: `url(${music.cover})` }}
          ></div>
          <Meta
            title={music.title}
            path={`/music/${id}`}
            description={`Ouça a música ${music.title}.`}
            baseUrl=""
            image={{
              src: music.cover || "",
              alt: music.title,
            }}
          />
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
                  {music.artist.image ? (
                    <Image
                      src={music.artist.image}
                      alt={music.artist.name}
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
                    href={`/artist/${music.artist.id}`}
                    title={music.artist.name}
                    className="hover:text-purple-400 focus:outline outline-2 rounded-sm outline-purple-400 active:opacity-70 duration-200"
                  >
                    {music.artist.name}
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
