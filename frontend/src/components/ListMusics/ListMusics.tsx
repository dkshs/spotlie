import Link from "next/link";
import type { MusicProps } from "@/utils/types";
import { MusicCard } from "../MusicCard";
import { Loading } from "../Loading";

interface ListMusicsProps {
  musics?: MusicProps[];
}

export function ListMusics({ musics }: ListMusicsProps) {
  return (
    <section className="px-9 mt-8">
      <header className="flex justify-between mb-4 items-center">
        <h1 className="font-bold text-xl">Músicas</h1>
        <Link
          href="/musics"
          className="bg-purple-800 py-1.5 px-4 rounded-3xl hover:scale-105 hover:bg-purple-600 focus:outline-none focus:ring-2 ring-blue-300 active:bg-purple-600/20 duration-200"
        >
          <span className="uppercase text-sm font-bold">Ver mais</span>
        </Link>
      </header>
      <div className="pb-3 flex flex-1 gap-8 overflow-x-auto w-[calc(100% - 20px)] snap-x snap-mandatory">
        {!musics ? (
          <div className="min-h-[244px] p-10">
            <Loading />
          </div>
        ) : (
          musics.map((music) => <MusicCard key={music.id} {...music} />)
        )}
      </div>
    </section>
  );
}
