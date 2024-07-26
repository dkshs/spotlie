"use client";

import type { PlaylistPropsWithMusics } from "@/utils/types";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";
import {
  Copy,
  LockSimple,
  LockSimpleOpen,
  PencilSimple,
  TrashSimple,
} from "@phosphor-icons/react";
import { useApi } from "@/hooks/useApi";

import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/DropdownMenu";

export interface PlaylistMenuProps {
  readonly playlist: PlaylistPropsWithMusics;
  readonly setDeleteDialogOpen: (open: boolean) => void;
  readonly setEditDialogOpen: (open: boolean) => void;
}

export function PlaylistMenu({
  playlist,
  setDeleteDialogOpen,
  setEditDialogOpen,
}: PlaylistMenuProps) {
  const router = useRouter();
  const { fetcher } = useApi();
  const { user } = useUser();
  const externalId = useMemo(
    () => (user?.publicMetadata.external_id as string) || null,
    [user?.publicMetadata.external_id],
  );

  const copyPlaylist = useCallback(async () => {
    const toastLoading = toast.loading("Copying playlist...");
    try {
      const pl = {
        name: playlist.name,
        description: playlist.description || "",
        musics: playlist?.musics.map((m) => m.id) || [],
      };
      const data = new FormData();
      data.append("playlist", JSON.stringify(pl));
      await fetcher("/playlists/", {
        method: "POST",
        needAuth: true,
        body: data,
      });
      toast.update(toastLoading, {
        render: "Playlist copied!",
        type: "success",
        isLoading: false,
        autoClose: 1000,
      });
      router.refresh();
    } catch (error) {
      const msg = (error as Error).message || "Failed to copy playlist!";
      toast.update(toastLoading, {
        render: msg,
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
      console.error(error);
    }
  }, [fetcher, playlist.description, playlist?.musics, playlist.name, router]);

  const handlePlaylistIsPublic = useCallback(async () => {
    const toastLoading = toast.loading("Updating playlist...");
    try {
      const data = new FormData();
      data.append(
        "playlist",
        JSON.stringify({ is_public: !playlist.is_public }),
      );
      await fetcher(`/playlists/${playlist.id}`, {
        method: "PATCH",
        needAuth: true,
        body: data,
      });
      toast.update(toastLoading, {
        render: `The playlist is now ${
          playlist.is_public ? "private" : "public"
        }!`,
        type: "success",
        isLoading: false,
        autoClose: 1000,
      });
      router.refresh();
    } catch (error) {
      const msg = (error as Error).message || "Failed to update playlist!";
      toast.update(toastLoading, {
        render: msg,
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
      console.error(error);
    }
  }, [fetcher, playlist.id, playlist.is_public, router]);

  return externalId === playlist.owner.id ? (
    <>
      <DropdownMenuGroup>
        <DropdownMenuItem
          className="flex gap-2"
          onClick={() => handlePlaylistIsPublic()}
        >
          {playlist.is_public ? (
            <>
              <LockSimple weight="bold" size={18} />
              <span>Make private</span>
            </>
          ) : (
            <>
              <LockSimpleOpen weight="bold" size={18} />
              <span>Make public</span>
            </>
          )}
        </DropdownMenuItem>
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
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem className="flex gap-2" onClick={() => copyPlaylist()}>
          <Copy weight="bold" size={18} />
          <span>Copy</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </>
  ) : (
    user && (
      <DropdownMenuGroup>
        <DropdownMenuItem className="flex gap-2" onClick={() => copyPlaylist()}>
          <Copy weight="bold" size={18} />
          <span>Copy</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    )
  );
}

export {
  type EditPlaylistDialogProps,
  EditPlaylistDialog,
} from "./EditMusicDialog";
export {
  type DeletePlaylistDialogProps,
  DeletePlaylistDialog,
} from "./DeletePlaylistDialog";
