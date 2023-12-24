"use client";

import { useCallback } from "react";
import { useCopyToClipboard } from "usehooks-ts";

import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "./ui/DropdownMenu";

import { Copy, Export } from "@phosphor-icons/react";

interface MenuShareItemProps {
  id: string;
  isPlaylist?: boolean;
}

export function MenuShareItem({ id, isPlaylist = false }: MenuShareItemProps) {
  const [, copyToClipboard] = useCopyToClipboard();

  const copy = useCallback(() => {
    const path = isPlaylist ? "playlist" : "music";
    const url = `${window.location.origin}/${path}/${id}`;
    copyToClipboard(url);
    console.log(url);
    return url;
  }, [copyToClipboard, id, isPlaylist]);

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="flex gap-2">
        <Export weight="bold" size={18} />
        <span>Share</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuItem className="flex gap-2" onClick={() => copy()}>
            <Copy weight="bold" size={18} />
            <span>Copy link</span>
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
