"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Plus } from "@phosphor-icons/react";
import { useApi } from "@/hooks/useApi";

import { Button } from "@/components/ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

export function CreatePlaylist() {
  const router = useRouter();
  const { fetcher } = useApi();

  const createPlaylist = useCallback(async () => {
    const toastLoading = toast.loading("Creating playlist...");
    try {
      const data = new FormData();
      data.append("playlist", JSON.stringify({ name: "My Playlist" }));
      await fetcher("/playlists/", {
        method: "POST",
        needAuth: true,
        body: data,
      });
      toast.update(toastLoading, {
        render: "Playlist created!",
        type: "success",
        isLoading: false,
        autoClose: 1000,
      });
      router.refresh();
    } catch (error) {
      const msg = (error as Error).message || "Failed to create playlist!";
      toast.update(toastLoading, {
        render: msg,
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
      console.error(error);
    }
  }, [fetcher, router]);

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            radius="full"
            variant="outline"
            className="flex scale-100 gap-2 hover:scale-100"
            aria-label="Create playlist"
            onClick={() => createPlaylist()}
          >
            <Plus size={18} weight="bold" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Create a new playlist</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
