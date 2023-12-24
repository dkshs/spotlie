"use client";

import type { PlaylistPropsWithMusics } from "@/utils/types";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useApi } from "@/hooks/useApi";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";
import { Button } from "../ui/Button";
import { DeleteDialog } from "./DeleteDialog";
import { EditDialog } from "./EditDialog";
import { MenuShareItem } from "../MenuShareItem";

import {
  DotsThree,
  PencilSimple,
  TrashSimple,
  Copy,
} from "@phosphor-icons/react";

export interface PlaylistMenuProps {
  playlist: PlaylistPropsWithMusics;
}

export function PlaylistMenu({ playlist }: PlaylistMenuProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
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

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            className="absolute right-0 z-20 mr-2 w-fit scale-100 px-1 opacity-0 duration-200 hover:scale-100 focus:opacity-100 group-focus-within:opacity-100 group-hover:opacity-100 data-[state='open']:opacity-100"
            size="icon"
            variant="ghost"
          >
            <span className="sr-only">Open Playlist menu</span>
            <DotsThree size={32} weight="bold" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit">
          {externalId === playlist.owner.id ? (
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
                <DropdownMenuItem
                  className="flex gap-2"
                  onClick={() => copyPlaylist()}
                >
                  <Copy weight="bold" size={18} />
                  <span>Copy</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
          ) : (
            user && (
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="flex gap-2"
                  onClick={() => copyPlaylist()}
                >
                  <Copy weight="bold" size={18} />
                  <span>Copy</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            )
          )}
          {user && <DropdownMenuSeparator />}
          <DropdownMenuGroup>
            <MenuShareItem id={playlist.id} isPlaylist />
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteDialog
        playlist={playlist}
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
      />
      <EditDialog
        playlist={playlist}
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
      />
    </>
  );
}
