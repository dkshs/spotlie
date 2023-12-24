"use client";

import type { MusicProps, PlaylistPropsWithMusics } from "@/utils/types";

import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useApi } from "@/hooks/useApi";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";
import { Button } from "./ui/Button";

import {
  DotsThree,
  MusicNote,
  Plus,
  TrashSimple,
  User,
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

export interface MusicMenuProps {
  music: MusicProps;
  showGoToArtist?: boolean;
  showGoToMusic?: boolean;
  playlistId?: string;
}

export function MusicMenu({
  music,
  playlistId,
  showGoToArtist = true,
  showGoToMusic = true,
}: MusicMenuProps) {
  const router = useRouter();
  const { fetcher } = useApi();
  const { user } = useUser();

  const { data: playlists, refetch } = useQuery<
    PlaylistPropsWithMusics[] | null
  >({
    queryKey: [user?.id, "playlists"],
    queryFn: async () => {
      if (!user) return null;
      const externalId = (user.publicMetadata.external_id as string) || null;
      if (!externalId) return null;
      try {
        const data = await fetcher<PlaylistPropsWithMusics[]>("/playlists", {
          searchParams: { object_id: externalId },
        });
        return data || null;
      } catch (error) {
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const addMusicToPlaylist = useCallback(
    async (playlistId: string, musicsId: string[]) => {
      try {
        await fetcher(`/playlists/${playlistId}/add_musics`, {
          method: "PATCH",
          body: JSON.stringify(musicsId),
          needAuth: true,
        });
      } catch (error) {
        console.error(error);
      }
    },
    [fetcher],
  );
  const deleteMusicToPlaylist = useCallback(
    async (playlistId: string, musicsId: string[]) => {
      try {
        await fetcher(`/playlists/${playlistId}/remove_musics`, {
          method: "PATCH",
          body: JSON.stringify(musicsId),
          needAuth: true,
        });
        await router.refresh();
      } catch (error) {
        console.error(error);
      }
    },
    [fetcher, router],
  );

  const createPlaylist = useCallback(
    async (name: string, musicId: string) => {
      const data = new FormData();
      data.append("playlist", JSON.stringify({ name, musics: [musicId] }));
      try {
        await fetcher("/playlists/", {
          method: "POST",
          body: data,
          needAuth: true,
        });
        await refetch();
      } catch (error) {
        console.error(error);
      }
    },
    [fetcher, refetch],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          className="absolute right-0 z-20 mr-2 w-fit scale-100 px-1 opacity-0 duration-200 hover:scale-100 focus:opacity-100 group-focus-within:opacity-100 group-hover:opacity-100 data-[state='open']:opacity-100"
          size="icon"
          variant="ghost"
        >
          <span className="sr-only">Open music menu</span>
          <DotsThree size={32} weight="bold" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit">
        {user && (
          <>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex gap-2">
                <Plus weight="bold" size={18} />
                <span>Add to Playlist</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    className="flex gap-2"
                    onClick={() => createPlaylist(music.title, music.id)}
                  >
                    <Plus weight="bold" size={18} />
                    <span>Create Playlist</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {playlists?.map((playlist) => (
                    <DropdownMenuItem
                      key={playlist.id}
                      onClick={() =>
                        addMusicToPlaylist(playlist.id, [music.id])
                      }
                    >
                      {playlist.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            {playlistId && (
              <DropdownMenuItem
                className="flex gap-2"
                onClick={() => deleteMusicToPlaylist(playlistId, [music.id])}
              >
                <TrashSimple weight="bold" size={18} />
                <span>Delete from this playlist</span>
              </DropdownMenuItem>
            )}
            {(showGoToArtist || showGoToMusic) && <DropdownMenuSeparator />}
          </>
        )}
        {showGoToMusic && (
          <DropdownMenuItem asChild>
            <Link href={`/music/${music.id}`} className="flex gap-2">
              <MusicNote weight="bold" size={18} />
              <span>Go to music</span>
            </Link>
          </DropdownMenuItem>
        )}
        {showGoToArtist && (
          <DropdownMenuItem asChild>
            <Link href={`/artist/${music.artist.id}`} className="flex gap-2">
              <User weight="bold" size={18} />
              <span>Go to artist</span>
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
