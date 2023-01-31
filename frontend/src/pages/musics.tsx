import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

import type { MusicProps } from "@/utils/types";

import Image from "next/image";
import Link from "next/link";
import { Meta } from "@/components/Meta";

import { Pause, Play } from "phosphor-react";
import { useMusic } from "@/hooks/useMusic";

export default function MusicsPage() {
  const { currentMusic, musicState, playMusic, pauseMusic } = useMusic();

  const skeletonItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [query, setQuery] = useState("");

  const { data: musics, isFetching } = useQuery<MusicProps[]>({
    queryKey: ["all-musics"],
    queryFn: async () => {
      const response = await api.get("/musics");
      return response.data;
    },
    staleTime: 1000 * 60,
  });

  const filteredMusics =
    query === ""
      ? musics
      : musics?.filter((music) =>
          music.title
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, "")),
        );

  return (
    <>
      <Meta title="Músicas" path="/musics" />
      <div className="px-4 sm:px-9 mt-6">
        <div className="flex gap-2 flex-wrap justify-between items-center">
          <h1 className="text-2xl font-bold">Músicas</h1>
          <label className="sr-only" htmlFor="searchForMusic">
            Procure por uma música
          </label>
          <input
            type="text"
            placeholder="Procure por uma música..."
            id="searchForMusic"
            className="bg-black/30 pl-4 pr-2 sm:px-5 py-2 rounded-3xl focus:outline-none focus:ring-2 ring-purple-500"
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div
          className={`${
            filteredMusics?.length === 0 && query !== "" ? "flex" : "grid"
          } grid-cols-1 sm:grid-cols-2 gap-1 pt-6`}
        >
          {isFetching || !filteredMusics ? (
            skeletonItems.map((i) => (
              <div
                key={i}
                className="flex items-center px-4 py-2 rounded-md gap-3"
              >
                <div className="relative rounded-lg min-w-[50px] min-h-[50px]">
                  <div className="rounded-lg w-[50px] h-[50px] bg-black/40 animate-pulse" />
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <span className="h-6 w-1/3 bg-black/20 rounded-lg animate-pulse" />
                  <span className="h-5 w-1/3 bg-black/20 rounded-lg animate-pulse" />
                </div>
              </div>
            ))
          ) : filteredMusics.length === 0 && query !== "" ? (
            <div className="col-span-2 w-full flex flex-col justify-center py-4 px-4">
              <span className="text-center mt-4">
                Nenhuma música encontrada
              </span>
            </div>
          ) : (
            filteredMusics.map((music) => (
              <button
                type="button"
                key={music.id}
                onClick={() =>
                  musicState === "playing" && currentMusic?.id === music.id
                    ? pauseMusic()
                    : playMusic(music)
                }
                className="flex items-center px-4 py-2 rounded-md gap-3 hover:bg-black/30 focus:outline-none focus:bg-black/50 group duration-200"
              >
                <div className="relative rounded-lg min-w-[50px] min-h-[50px]">
                  <Image
                    className="aspect-square rounded-lg object-cover shadow-lg bg-black/40"
                    src={music.cover}
                    alt={music.title}
                    width={50}
                    height={50}
                  />
                  <div
                    className={`absolute rounded-lg justify-center items-center inset-0 ${
                      musicState === "playing" && music.id === currentMusic?.id
                        ? "flex bg-black/50"
                        : "hidden group-hover:flex group-hover:bg-black/50"
                    }`}
                  >
                    <div className="rounded-full duration-200">
                      {musicState === "playing" &&
                      currentMusic?.id === music.id ? (
                        <>
                          <Image
                            src="/musicPlaying.gif"
                            alt="Música tocando"
                            className="group-hover:hidden flex"
                            height={24}
                            width={24}
                          />
                          <Pause
                            size={24}
                            weight="fill"
                            className="hidden hover:text-purple-400 group-hover:flex duration-300"
                          />
                        </>
                      ) : (
                        <Play
                          size={24}
                          weight="fill"
                          className="hover:text-purple-400 duration-300"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-0.5 text-base font-normal truncate text-start">
                  <Link
                    href={`/music/${music.id}`}
                    className="focus:outline-none truncate pr-2.5 focus:text-purple-400 hover:text-purple-400 active:opacity-70 duration-200"
                  >
                    {music.title}
                  </Link>
                  <div className="truncate pr-2.5">
                    {music.singers?.map((singer) => (
                      <Link
                        key={singer.id}
                        href={`/singer/${singer.id}`}
                        className="focus:outline-none focus:text-purple-400 hover:text-purple-400 active:opacity-70 duration-200"
                      >
                        {singer.name}
                        {music.singers.length > 1 && ", "}
                      </Link>
                    ))}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
}
