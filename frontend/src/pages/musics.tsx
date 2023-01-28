import { Meta } from "@/components/Meta";
import { musics as initialMusics } from "@/utils/musics";
import Image from "next/image";
import Link from "next/link";

import { Play } from "phosphor-react";
import { useState } from "react";

export default function MusicsPage() {
  const [musics] = useState(initialMusics);
  const [query, setQuery] = useState("");

  const filteredMusics =
    query === ""
      ? musics
      : musics.filter((music) =>
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
            filteredMusics.length === 0 && query !== "" ? "flex" : "grid"
          } grid-cols-1 sm:grid-cols-2 pt-6`}
        >
          {filteredMusics.length === 0 && query !== "" ? (
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
                className="flex items-center px-4 py-2 rounded-md gap-3 hover:bg-black/30 focus:outline-none focus:bg-black/50 group duration-200"
              >
                <div className="relative rounded-lg min-w-[50px] min-h-[50px]">
                  <Image
                    className="aspect-square rounded-lg object-cover shadow-lg"
                    src={music.cover}
                    alt={music.title}
                    width={50}
                    height={50}
                  />
                  <div className="hidden rounded-lg absolute group-hover:flex justify-center items-center inset-0 group-hover:bg-black/50">
                    <button type="button" className="rounded-full duration-200">
                      <Play size={24} weight="fill" />
                    </button>
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
                    {music.singers.map((singer) => (
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
