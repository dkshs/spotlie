import type { MusicProps } from "@/utils/types";

import Image from "next/image";
import Link from "next/link";
import { ControlButton } from "./ControlButton";

interface MusicCardProps {
  music: MusicProps;
  playlist?: MusicProps[];
}

export function MusicCard({ music, playlist }: MusicCardProps) {
  return (
    <div className="group relative flex h-60 w-40 cursor-pointer snap-center flex-col items-center gap-4 rounded-lg bg-secondary/40 p-2 duration-200 focus-within:bg-secondary hover:bg-secondary md:h-72 md:w-52 md:p-4">
      <Link
        href={`/music/${music.id}`}
        className="absolute inset-0 z-10"
        tabIndex={-1}
        aria-hidden={true}
        aria-label={music.title}
      />
      <div className="relative h-[65%] min-h-[65%] w-36 overflow-hidden rounded-lg bg-background bg-gradient-to-tr from-background/60 to-primary/20 shadow-lg shadow-background/60 md:w-44">
        {music.image && (
          <Image
            alt={music.title}
            src={music.image}
            className="aspect-square object-cover"
            fill
          />
        )}
        <ControlButton music={music} playlist={playlist} />
      </div>
      <div className="z-20 flex w-full flex-col items-start">
        <Link
          href={`/music/${music.id}`}
          className="w-full truncate rounded-lg text-lg font-bold outline-ring hover:underline focus-visible:outline"
        >
          {music.title}
        </Link>
        <Link
          href={`/artist/${music.artist.id}`}
          className="w-full truncate rounded-lg text-sm outline-ring hover:underline focus-visible:outline"
        >
          {music.artist.username}
        </Link>
      </div>
    </div>
  );
}
