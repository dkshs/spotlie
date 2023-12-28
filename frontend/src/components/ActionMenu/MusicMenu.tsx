"use client";

import type { MusicProps, PlaylistPropsWithMusics } from "@/utils/types";

import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useApi } from "@/hooks/useApi";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";
import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/DropdownMenu";

import { Plus, TrashSimple } from "@phosphor-icons/react";

export interface MusicMenuProps {
  music: MusicProps;
  playlist?: PlaylistPropsWithMusics;
  orderId?: number;
}

export function MusicMenu({ music, playlist, orderId }: MusicMenuProps) {
  const router = useRouter();
  const { fetcher } = useApi();
  const { user } = useUser();
  const externalId = (user?.publicMetadata.external_id as string) || null;
  const ownsThePlaylist = playlist?.owner.id === externalId;

  const { data: playlists, refetch } = useQuery<
    PlaylistPropsWithMusics[] | null
  >({
    queryKey: ["playlists"],
    queryFn: async () => {
      if (!user || !externalId) return null;
      try {
        const res = await fetcher<PlaylistPropsWithMusics[]>("/playlists/", {
          searchParams: { object_id: externalId },
        });
        return res.data || null;
      } catch (error) {
        return null;
      }
    },
    staleTime: 1000 * 30,
    enabled: !!user && !!externalId,
    refetchOnWindowFocus: false,
  });

  const addMusicToPlaylist = useCallback(
    async (playlistId: string, musicsId: string[]) => {
      const toastLoading = toast.loading("Adding music...");
      try {
        await fetcher(`/playlists/${playlistId}/add_musics`, {
          method: "PATCH",
          body: JSON.stringify(musicsId),
          needAuth: true,
        });
        toast.update(toastLoading, {
          render: "Music added!",
          type: "success",
          isLoading: false,
          autoClose: 1000,
        });
        router.refresh();
      } catch (error) {
        const msg = (error as Error).message || "Failed to add music!";
        toast.update(toastLoading, {
          render: msg,
          type: "error",
          isLoading: false,
          autoClose: 1000,
        });
        console.error(error);
      }
    },
    [fetcher, router],
  );
  const deleteMusicToPlaylist = useCallback(
    async (playlistId: string, musicsId: string[]) => {
      const toastLoading = toast.loading("Removing music...");
      try {
        await fetcher(`/playlists/${playlistId}/remove_musics`, {
          method: "PATCH",
          body: JSON.stringify(musicsId),
          needAuth: true,
        });
        toast.update(toastLoading, {
          render: "Music removed!",
          type: "success",
          isLoading: false,
          autoClose: 1000,
        });
        router.refresh();
      } catch (error) {
        const msg = (error as Error).message || "Failed to remove music!";
        toast.update(toastLoading, {
          render: msg,
          type: "error",
          isLoading: false,
          autoClose: 1000,
        });
        console.error(error);
      }
    },
    [fetcher, router],
  );

  const createPlaylist = useCallback(
    async (name: string, musicId: string) => {
      const toastLoading = toast.loading("Creating playlist...");
      const data = new FormData();
      data.append("playlist", JSON.stringify({ name, musics: [musicId] }));
      try {
        await fetcher("/playlists/", {
          method: "POST",
          body: data,
          needAuth: true,
        });
        toast.update(toastLoading, {
          render: "Playlist created successfully!",
          type: "success",
          isLoading: false,
          autoClose: 1000,
        });
        await refetch();
      } catch (error) {
        const msg =
          (error as Error).message ||
          "Failed to create playlist! Please try again later.";
        toast.update(toastLoading, {
          render: msg,
          type: "error",
          isLoading: false,
          autoClose: 1000,
        });
        console.error(error);
      }
    },
    [fetcher, refetch],
  );

  return (
    user && (
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
                  onClick={() => addMusicToPlaylist(playlist.id, [music.id])}
                >
                  {playlist.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        {playlist && ownsThePlaylist && (
          <DropdownMenuItem
            className="flex gap-2"
            onClick={() =>
              deleteMusicToPlaylist(playlist.id, [`${orderId}` || music.id])
            }
          >
            <TrashSimple weight="bold" size={18} />
            <span>Delete from this playlist</span>
          </DropdownMenuItem>
        )}
      </>
    )
  );
}
