"use client";

import type { ActionType } from "./types";

import { useCallback } from "react";
import { useCopyToClipboard } from "usehooks-ts";

import { toast } from "react-toastify";
import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/DropdownMenu";

import { Copy, Export } from "@phosphor-icons/react";

interface ShareItemProps {
  id: string;
  path?: ActionType;
}

export function ShareItem({ id, path = "music" }: ShareItemProps) {
  const [, copyToClipboard] = useCopyToClipboard();

  const copy = useCallback(() => {
    copyToClipboard(`${window.location.origin}/${path}/${id}`);
    toast.success("Link copied to clipboard");
  }, [copyToClipboard, id, path]);

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
