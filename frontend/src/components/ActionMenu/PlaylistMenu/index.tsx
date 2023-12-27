"use client";

import type { PlaylistPropsWithMusics } from "@/utils/types";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useApi } from "@/hooks/useApi";

import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/DropdownMenu";
import { DeleteDialog } from "./DeleteDialog";
import { EditDialog } from "./EditDialog";

import { PencilSimple, TrashSimple, Copy } from "@phosphor-icons/react";

export interface PlaylistMenuProps {
  playlist: PlaylistPropsWithMusics;
  setDeleteDialogOpen: (open: boolean) => void;
  setEditDialogOpen: (open: boolean) => void;
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
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  }, [fetcher, playlist.description, playlist?.musics, playlist.name, router]);

  return externalId === playlist.owner.id ? (
    <>
      <DropdownMenuGroup>
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

export { DeleteDialog, EditDialog };
