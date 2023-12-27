"use client";

import type { ActionMenuProps, ActionType } from "./types";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

import { cn } from "@/lib/utils";

import Link from "next/link";
import { ShareItem } from "./ShareItem";
import { MusicMenu } from "./MusicMenu";
import { PlaylistMenu, DeleteDialog, EditDialog } from "./PlaylistMenu";
import { Button } from "../ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";

import {
  DotsThree,
  MusicNote,
  User,
  UserCirclePlus,
} from "@phosphor-icons/react";

export function ActionMenu({
  actionId,
  actionType = "music",
  triggerClassName,
  label,
  music,
  user,
  playlist,
  showGoToArtist = true,
  showGoToMusic = true,
}: ActionMenuProps) {
  const { user: clerkUser } = useUser();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const externalId = (clerkUser?.publicMetadata.external_id as string) || null;

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
          (actionType === "artist" || actionType === "user") && (
            <>
              <DropdownMenuItem className="flex gap-2">
                <UserCirclePlus weight="bold" size={18} />
                <span>Follow</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
        {playlist && actionType === "playlist" && (
          <>
            <PlaylistMenu
              playlist={playlist}
              setDeleteDialogOpen={setDeleteDialogOpen}
              setEditDialogOpen={setEditDialogOpen}
            />
            {clerkUser && <DropdownMenuSeparator />}
          </>
        )}
        {music && actionType === "music" && (
          <>
            <MusicMenu music={music} playlist={playlist} />
            {clerkUser && (showGoToArtist || showGoToMusic) && (
              <DropdownMenuSeparator />
            )}
          </>
        )}
        {music && showGoToMusic && actionType === "music" && (
          <>
            <DropdownMenuItem asChild>
              <Link href={`/music/${music.id}`} className="flex gap-2">
                <MusicNote weight="bold" size={18} />
                <span>Go to music</span>
              </Link>
            </DropdownMenuItem>
            {!showGoToArtist && <DropdownMenuSeparator />}
          </>
        )}
        {music && showGoToArtist && actionType === "music" && (
          <>
            <DropdownMenuItem asChild>
              <Link href={`/artist/${music.artist.id}`} className="flex gap-2">
                <User weight="bold" size={18} />
                <span>Go to artist</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <ShareItem id={actionId} path={actionType} />
      </DropdownMenuContent>
      {playlist && actionType === "playlist" && (
        <>
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
      )}
    </DropdownMenu>
  );
}

export type { ActionMenuProps, ActionType };
