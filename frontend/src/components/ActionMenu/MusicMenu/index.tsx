"use client";

import type { MusicProps, PlaylistPropsWithMusics } from "@/utils/types";

import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";
import {
  PencilSimple,
  Plus,
  PlusCircle,
  TrashSimple,
} from "@phosphor-icons/react";
import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/DropdownMenu";

import { useApi } from "@/hooks/useApi";

export interface MusicMenuProps {
  readonly music: MusicProps;
  readonly playlist?: PlaylistPropsWithMusics;
  readonly orderId?: number;
  readonly setEditDialogOpen: (open: boolean) => void;
  readonly setDeleteDialogOpen: (open: boolean) => void;
}

export function MusicMenu({
  music,
  playlist,
  orderId,
  setEditDialogOpen,
  setDeleteDialogOpen,
}: MusicMenuProps) {
  const router = useRouter();
  const { fetcher } = useApi();
  const { user } = useUser();
  const publicMetadata = user?.publicMetadata;
  const externalId = (publicMetadata?.external_id as string) || null;
  const isArtist = (publicMetadata?.is_artist as boolean) || false;
  const ownsThePlaylist = playlist?.owner.id === externalId;
  const ownsTheMusic = music.artist.id === externalId;

  const { data: isLikedMusic = false } = useQuery<boolean>({
    queryKey: ["liked_music"],
    queryFn: async () => {
      if (!user || !externalId) return false;
      try {
        const res = await fetcher(`/musics/${music.id}/liked`, {
          needAuth: true,
        });
        return !!res.data || false;
      } catch {
        return false;
      }
    },
  });

  const { data: playlists, refetch } = useQuery<
    PlaylistPropsWithMusics[] | null
  >({
    queryKey: ["playlists"],
    queryFn: async () => {
      if (!user || !externalId) return null;
      try {
        const res = await fetcher<PlaylistPropsWithMusics[]>("/playlists/", {
          searchParams: { object_id: externalId },
          needAuth: true,
        });
        return res.data || null;
      } catch {
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
        router.refresh();
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
    [fetcher, refetch, router],
  );

  const handleLikedMusics = useCallback(async () => {
    const toastLoading = toast.loading(
      `${isLikedMusic ? "Removing" : "Saving"} music...`,
    );
    try {
      await fetcher(`/musics/${music.id}/handle_liked_musics`, {
        method: "POST",
        needAuth: true,
      });
      toast.update(toastLoading, {
        render: `Music ${isLikedMusic ? "removed" : "saved"}!`,
        type: "success",
        isLoading: false,
        autoClose: 1000,
      });
      router.refresh();
    } catch (error) {
      const msg =
        (error as Error).message ||
        `Failed to ${isLikedMusic ? "remove" : "save"} music!`;
      toast.update(toastLoading, {
        render: msg,
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
      console.error(error);
    }
  }, [fetcher, isLikedMusic, music.id, router]);

  return (
    user && (
      <>
        {isArtist && ownsTheMusic ? (
          <>
            <DropdownMenuItem
              className="flex gap-2"
              onClick={() => setEditDialogOpen(true)}
            >
              <PencilSimple weight="bold" size={18} />
              <span>Edit details</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex gap-2"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <TrashSimple weight="bold" size={18} />
              <span>Delete music</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        ) : null}
        <DropdownMenuSub>
          <DropdownMenuItem
            className="flex gap-2"
            onClick={() => handleLikedMusics()}
          >
            {isLikedMusic ? (
              <TrashSimple weight="bold" size={18} />
            ) : (
              <PlusCircle weight="bold" size={18} />
            )}
            <span>
              {isLikedMusic ? "Remove from" : "Save to"} your Liked Musics
            </span>
          </DropdownMenuItem>
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
              {playlists && playlists.length > 0 ? (
                <DropdownMenuSeparator />
              ) : null}
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
        {playlist && ownsThePlaylist ? (
          <DropdownMenuItem
            className="flex gap-2"
            onClick={() =>
              deleteMusicToPlaylist(playlist.id, [`${orderId}` || music.id])
            }
          >
            <TrashSimple weight="bold" size={18} />
            <span>Delete from this playlist</span>
          </DropdownMenuItem>
        ) : null}
      </>
    )
  );
}

export { EditMusicDialog, type EditMusicDialogProps } from "./EditMusicDialog";
export {
  DeleteMusicDialog,
  type DeleteMusicDialogProps,
} from "./DeleteMusicDialog";
