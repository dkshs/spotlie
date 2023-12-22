import type { MusicProps, PlaylistPropsWithMusics } from "@/utils/types";

import Image from "next/image";
import Link from "next/link";
import { ControlButton } from "./ControlButton";

interface VerticalMusicCardProps {
  music: MusicProps;
  musics?: MusicProps[];
  playlist?: PlaylistPropsWithMusics;
  showArtist?: boolean;
}

function VerticalMusicCard({
  music,
  musics,
  playlist,
  showArtist = true,
}: VerticalMusicCardProps) {
  const isPlaylist = !!playlist;

  return (
    <div className="group relative flex h-60 w-40 cursor-pointer snap-center flex-col items-center gap-4 rounded-lg bg-secondary/50 p-2 md:h-72 md:w-52 md:p-4">
      <div className="absolute inset-0 z-[-1] size-full scale-95 rounded-lg bg-secondary opacity-0 duration-300 group-focus-within:scale-100 group-focus-within:opacity-100 group-hover:scale-100 group-hover:opacity-100" />
      <Link
        href={`/${isPlaylist ? "playlist" : "music"}/${
          isPlaylist ? playlist.id : music.id
        }`}
        className="absolute inset-0 z-10"
        tabIndex={-1}
        aria-hidden={true}
        aria-label={isPlaylist ? playlist.name : music.title}
      />
      <div className="relative h-[65%] min-h-[65%] w-36 overflow-hidden rounded-lg bg-background bg-gradient-to-tr from-background/60 to-primary/20 shadow-lg shadow-background/60 md:w-44">
        {isPlaylist && playlist.image ? (
          <Image
            alt={playlist.name}
            src={playlist.image}
            className="aspect-square object-cover"
            fill
          />
        ) : (
          !isPlaylist &&
          music.image && (
            <Image
              alt={music.title}
              src={music.image}
              className="aspect-square object-cover"
              fill
            />
          )
        )}
        {isPlaylist && playlist.musics.length > 0 ? (
          <ControlButton
            music={playlist.musics[0]!}
            playlist={playlist.musics}
          />
        ) : (
          <ControlButton music={music} playlist={musics} />
        )}
      </div>
      <div className="z-20 flex w-full flex-col items-start truncate">
        <Link
          href={`/${isPlaylist ? "playlist" : "music"}/${
            isPlaylist ? playlist.id : music.id
          }`}
          className="w-full max-w-fit truncate rounded-lg border border-transparent text-lg font-bold hover:underline focus-visible:border-ring focus-visible:outline-none"
        >
          {isPlaylist ? playlist.name : music.title}
        </Link>
        {showArtist && (
          <Link
            href={`/artist/${isPlaylist ? playlist.name : music.artist.id}`}
            className="w-full max-w-fit truncate rounded-lg border border-transparent text-sm hover:underline focus-visible:border-ring focus-visible:outline-none"
          >
            {isPlaylist ? playlist.owner.username : music.artist.username}
          </Link>
        )}
      </div>
    </div>
  );
}

export { VerticalMusicCard, type VerticalMusicCardProps };
