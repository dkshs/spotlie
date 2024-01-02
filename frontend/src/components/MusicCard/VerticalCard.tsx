import type { MusicProps, PlaylistPropsWithMusics } from "@/utils/types";

import Image from "next/image";
import Link from "next/link";
import { ControlButton } from "./ControlButton";
import { ActionMenu } from "../ActionMenu";

interface VerticalMusicCardProps {
  music: MusicProps;
  musics?: MusicProps[];
  playlist?: PlaylistPropsWithMusics;
  showArtist?: boolean;
  text?: string;
}

function VerticalMusicCard({
  music,
  musics,
  playlist,
  text,
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
        {isPlaylist && (playlist.image || playlist?.musics[0]?.image) ? (
          <Image
            alt={playlist.name}
            src={(playlist.image || playlist?.musics[0]?.image)!}
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
          !isPlaylist && <ControlButton music={music} playlist={musics} />
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
        {showArtist && !isPlaylist ? (
          <Link
            href={`/artist/${music.artist.id}`}
            className="w-full max-w-fit truncate rounded-lg border border-transparent text-sm text-foreground/60 hover:underline focus-visible:border-ring focus-visible:outline-none"
          >
            {music.artist.full_name}
          </Link>
        ) : (
          text && (
            <p className="w-full max-w-fit truncate text-sm text-foreground/60">
              {text}
            </p>
          )
        )}
      </div>
      <div className="absolute inset-0">
        <ActionMenu
          actionId={isPlaylist ? playlist.id : music.id}
          actionType={isPlaylist ? "playlist" : "music"}
          music={music}
          playlist={playlist}
          showGoToArtist={!isPlaylist}
          showGoToMusic={!isPlaylist}
          triggerClassName="scale-100 bottom-1 right-1 m-0 hover:bg-background/60 md:bottom-2 md:right-2"
        />
      </div>
    </div>
  );
}

export { VerticalMusicCard, type VerticalMusicCardProps };
