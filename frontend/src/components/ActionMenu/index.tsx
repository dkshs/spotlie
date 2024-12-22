"use client";

import type { ActionMenuProps, ActionType } from "./types";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  DotsThree,
  MusicNote,
  User,
  UserCirclePlus,
} from "@phosphor-icons/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "../ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";
import { DeleteMusicDialog, EditMusicDialog, MusicMenu } from "./MusicMenu";
import {
  DeletePlaylistDialog,
  EditPlaylistDialog,
  PlaylistMenu,
} from "./PlaylistMenu";
import { ShareItem } from "./ShareItem";

export function ActionMenu({
  actionId,
  actionType = "music",
  triggerClassName,
  label,
  music,
  orderId,
  user,
  playlist,
  showGoToArtist = true,
  showGoToMusic = true,
}: ActionMenuProps) {
  const { user: clerkUser } = useUser();
  const [deletePlaylistDialogOpen, setDeletePlaylistDialogOpen] =
    useState(false);
  const [editPlaylistDialogOpen, setEditPlaylistDialogOpen] = useState(false);
  const [editMusicDialogOpen, setEditMusicDialogOpen] = useState(false);
  const [deleteMusicDialogOpen, setDeleteMusicDialogOpen] = useState(false);
  const publicMetadata = clerkUser?.publicMetadata;
  const externalId = (publicMetadata?.external_id as string) || null;
  const isArtist = (publicMetadata?.is_artist as boolean) || false;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          className={cn(
            "absolute right-0 z-20 mr-2 w-fit px-1 opacity-0 duration-200 hover:scale-100 focus:opacity-100 group-focus-within:opacity-100 group-hover:opacity-100 data-[state='open']:opacity-100",
            triggerClassName,
          )}
          size="icon"
          variant="ghost"
        >
          <span className="sr-only">{label || `Open ${actionType} menu`}</span>
          <DotsThree size={32} weight="bold" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit">
        {externalId &&
        user &&
        externalId !== user.id &&
        (actionType === "artist" || actionType === "user") ? (
          <>
            <DropdownMenuItem className="flex gap-2">
              <UserCirclePlus weight="bold" size={18} />
              <span>Follow</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        ) : null}
        {playlist && actionType === "playlist" ? (
          <>
            <PlaylistMenu
              playlist={playlist}
              setDeleteDialogOpen={setDeletePlaylistDialogOpen}
              setEditDialogOpen={setEditPlaylistDialogOpen}
            />
            {clerkUser ? <DropdownMenuSeparator /> : null}
          </>
        ) : null}
        {music && actionType === "music" ? (
          <>
            <MusicMenu
              music={music}
              playlist={playlist}
              orderId={orderId}
              setEditDialogOpen={setEditMusicDialogOpen}
              setDeleteDialogOpen={setDeleteMusicDialogOpen}
            />
            {clerkUser && (showGoToArtist || showGoToMusic) ? (
              <DropdownMenuSeparator />
            ) : null}
          </>
        ) : null}
        {music && showGoToMusic && actionType === "music" ? (
          <>
            <DropdownMenuItem asChild>
              <Link href={`/music/${music.id}`} className="flex gap-2">
                <MusicNote weight="bold" size={18} />
                <span>Go to music</span>
              </Link>
            </DropdownMenuItem>
            {!showGoToArtist && <DropdownMenuSeparator />}
          </>
        ) : null}
        {music && showGoToArtist && actionType === "music" ? (
          <>
            <DropdownMenuItem asChild>
              <Link href={`/artist/${music.artist.id}`} className="flex gap-2">
                <User weight="bold" size={18} />
                <span>Go to artist</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        ) : null}
        <ShareItem id={actionId} path={actionType} />
      </DropdownMenuContent>
      {playlist && actionType === "playlist" ? (
        <>
          <DeletePlaylistDialog
            playlist={playlist}
            open={deletePlaylistDialogOpen}
            setOpen={setDeletePlaylistDialogOpen}
          />
          <EditPlaylistDialog
            playlist={playlist}
            open={editPlaylistDialogOpen}
            setOpen={setEditPlaylistDialogOpen}
          />
        </>
      ) : null}
      {music && actionType === "music" && isArtist ? (
        <>
          <DeleteMusicDialog
            music={music}
            open={deleteMusicDialogOpen}
            setOpen={setDeleteMusicDialogOpen}
          />
          <EditMusicDialog
            music={music}
            open={editMusicDialogOpen}
            setOpen={setEditMusicDialogOpen}
          />
        </>
      ) : null}
    </DropdownMenu>
  );
}

export type { ActionMenuProps, ActionType };
