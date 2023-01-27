import Image from "next/image";
import Link from "next/link";
import { Play } from "phosphor-react";
import { SingerProps } from "../ListSingers/ListSingers";

export interface MusicProps {
  id: string;
  title: string;
  singers: SingerProps[];
  cover: string;
}

export interface ListMusicsProps {
  musics: MusicProps[];
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
        {musics.map((music) => (
          <div key={music.id} className="py-1 max-w-[178px] snap-center">
            <div className="relative rounded-lg overflow-hidden block min-h-[178px] min-w-[178px] group">
              <Image
                className="aspect-square object-cover shadow-xl shadow-black/60"
                src={music.cover}
                alt="Capa da música"
                width={178}
                height={178}
                priority
              />
              <div className="hidden absolute group-hover:flex justify-center items-center inset-0 group-hover:bg-black/50">
                <button
                  type="button"
                  className="p-3 bg-purple-600/40 backdrop-blur-sm rounded-full hover:scale-110 duration-200"
                >
                  <Play size={32} weight="fill" />
                </button>
              </div>
            </div>
            <div className="flex flex-col mt-2 gap-0.5 text-base font-normal truncate">
              <Link
                href={`/music/${music.id}`}
                className="truncate pr-2.5 focus:text-purple-400 hover:text-purple-400 active:opacity-70 duration-200"
              >
                {music.title}
              </Link>
              <div className="truncate pr-2.5">
                {music.singers.map((singer) => (
                  <Link
                    key={singer.id}
                    href={`/singer/${singer.id}`}
                    className="focus:text-purple-400 hover:text-purple-400 active:opacity-70 duration-200"
                  >
                    {singer.name}
                    {music.singers.length > 1 && ", "}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
