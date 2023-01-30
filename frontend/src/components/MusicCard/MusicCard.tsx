import type { MusicProps } from "@/utils/types";

import Image from "next/image";
import Link from "next/link";

import { Play } from "phosphor-react";

interface MusicCardProps {
  music: MusicProps;
}

export function MusicCard({ music }: MusicCardProps) {
  return (
    <div className="py-1 max-w-[178px] snap-center">
      <div className="relative rounded-lg overflow-hidden block min-h-[178px] min-w-[178px] group">
        <Image
          className="aspect-square object-cover shadow-xl shadow-black/60 bg-black/20"
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
  );
}
