import { Meta } from "@/components/Meta";
import { singers as initialSingers } from "@/utils/singers";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function SingersPage() {
  const [singers] = useState(initialSingers);
  const [query, setQuery] = useState("");

  const filteredSingers =
    query === ""
      ? singers
      : singers.filter((singer) =>
          singer.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, "")),
        );

  return (
    <>
      <Meta title="Cantores" path="/singers" />
      <div className="px-4 sm:px-9 mt-6">
        <div className="flex gap-2 flex-wrap justify-between items-center">
          <h1 className="text-2xl font-bold">Cantores</h1>
          <label className="sr-only" htmlFor="searchForSinger">
            Procure por um cantor
          </label>
          <input
            type="text"
            placeholder="Procure por um cantor..."
            id="searchForSinger"
            className="bg-black/30 pl-4 pr-2 sm:px-5 py-2 rounded-3xl focus:outline-none focus:ring-2 ring-purple-500"
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div
          className={`${
            filteredSingers.length === 0 && query !== "" ? "flex" : "grid"
          } grid-cols-1 sm:grid-cols-2 pt-6`}
        >
          {filteredSingers.length === 0 && query !== "" ? (
            <div className="flex flex-col w-full justify-center py-4 px-4">
              <span className="text-center mt-4">Nenhum cantor encontrado</span>
            </div>
          ) : (
            filteredSingers.map((singer) => (
              <Link
                key={singer.id}
                href={`/singer/${singer.id}`}
                className="flex px-4 py-2 rounded-md gap-3 hover:bg-black/30 focus:outline-none focus:bg-black/50 duration-200"
              >
                <div className="relative rounded-lg min-w-[50px] min-h-[50px]">
                  <Image
                    className="aspect-square rounded-lg object-cover shadow-lg hover:opacity-70 duration-200"
                    src={singer.img}
                    alt={singer.name}
                    width={50}
                    height={50}
                  />
                </div>
                <div className="flex flex-col mt-1 text-base font-normal truncate text-start">
                  <p className="truncate pr-2.5 hover:text-purple-400 active:opacity-70 capitalize duration-200">
                    {singer.name}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
}
