import type { PlaylistPropsWithMusics } from "@/utils/types";

import Image from "next/image";
import Link from "next/link";
import { ActionMenu } from "@/components/ActionMenu";
import { DataTitle } from "@/components/DataTitle";
import { ControlButton, MusicCard } from "@/components/MusicCard";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/HoverCard";

interface PlaylistPageProps {
  readonly playlist: PlaylistPropsWithMusics;
  readonly isStatic?: boolean;
}

export function PlaylistPage({
  playlist,
  isStatic = false,
}: PlaylistPageProps) {
  return (
    <div className="mb-20 mt-10 px-4 sm:px-9 md:mt-20">
      <div className="flex flex-col justify-center text-center md:min-h-[280px] md:flex-row md:justify-start md:text-start">
        {playlist.image || playlist.musics[0]?.image ? (
          <>
            <div className="absolute inset-0 z-[-1] bg-center md:h-80">
              <Image
                className="aspect-square bg-cover bg-center bg-no-repeat object-cover opacity-50 blur-2xl"
                src={(playlist.image || playlist.musics[0]?.image)!}
                alt={playlist.name}
                fill
              />
            </div>
            <div className="flex min-w-[280px] justify-center self-center rounded-md bg-black/50 md:mr-8 md:max-h-[280px] md:max-w-[280px]">
              <Image
                src={(playlist.image || playlist.musics[0]?.image)!}
                alt={playlist.name}
                className="aspect-square size-[280px] rounded-md object-cover shadow-xl shadow-black/40"
                width={280}
                height={280}
                priority
              />
            </div>
          </>
        ) : null}
        <div className="flex min-h-[280px] flex-col justify-evenly gap-2 md:justify-around">
          <div className="flex flex-col gap-2">
            <small className="text-xs font-extrabold uppercase text-white md:mt-4">
              Playlist
            </small>
            <DataTitle title={playlist.name} />
            <div className="flex items-center gap-2 self-center md:self-start">
              <div className="flex items-center gap-2 after:content-['•']">
                {playlist.owner?.image ? (
                  <Image
                    src={playlist.owner.image}
                    alt={playlist.owner.full_name}
                    className="size-6 rounded-full bg-black/20"
                    width={24}
                    height={24}
                  />
                ) : null}
                <Link
                  href={`/${playlist.owner_is_artist ? "artist" : "user"}/${
                    playlist.owner.id
                  }`}
                  title={playlist.owner.full_name}
                  className="rounded-sm font-bold outline-2 outline-purple-400 duration-200 hover:underline focus:outline active:opacity-70"
                >
                  {playlist.owner.full_name}
                </Link>
              </div>
              <HoverCard openDelay={200} closeDelay={100}>
                <HoverCardTrigger>
                  {new Date(playlist.created_at).getFullYear()}
                </HoverCardTrigger>
                <HoverCardContent side="top" className="w-fit px-3 py-2">
                  {new Date(playlist.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </HoverCardContent>
              </HoverCard>
              {playlist.musics ? (
                <div className="before:mr-1.5 before:content-['•']">
                  {playlist.musics.length} musics
                </div>
              ) : null}
            </div>
          </div>
          <div className="group relative flex self-center md:mt-3 md:self-start [&_button]:relative [&_button]:translate-y-0 [&_button]:opacity-100">
            {playlist.musics && playlist.musics.length > 0 ? (
              <ControlButton
                music={playlist.musics[0]!}
                playlist={playlist}
                isPlaylistBtn
              />
            ) : null}
            {!isStatic && (
              <div className="mt-1">
                <ActionMenu
                  playlist={playlist}
                  actionId={playlist.id}
                  actionType="playlist"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {playlist.musics && playlist.musics.length > 0 ? (
        <div className="mt-20 flex w-full flex-col gap-2 lg:max-w-[50%]">
          {playlist.musics.map(
            (music) =>
              music && (
                <div key={music.order_id} className="w-full">
                  <MusicCard
                    music={music}
                    orientation="horizontal"
                    actionId={music.id}
                    playlist={playlist}
                    orderId={music.order_id}
                  />
                </div>
              ),
          )}
        </div>
      ) : null}
    </div>
  );
}
