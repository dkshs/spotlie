"use client";

import type { MusicProps } from "@/utils/types";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

import { toast } from "react-toastify";
import { useApi } from "@/hooks/useApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog";

export interface DeleteMusicDialogProps extends React.PropsWithChildren {
  readonly music: MusicProps;
  readonly open?: boolean;
  readonly setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DeleteMusicDialog({
  music,
  children,
  setOpen,
  open = false,
}: DeleteMusicDialogProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { fetcher } = useApi();

  const deleteMusic = useCallback(async () => {
    const toastLoading = toast.loading("Deleting music...");
    try {
      let redirectUrl = null;
      if (pathname.startsWith("/music/")) {
        redirectUrl = `/artist/${music.artist.id}`;
      }
      await fetcher(`/musics/${music.id}`, {
        method: "DELETE",
        needAuth: true,
      });
      toast.update(toastLoading, {
        render: "Music deleted!",
        type: "success",
        isLoading: false,
        autoClose: 1000,
      });
      redirectUrl && router.push(redirectUrl);
      router.refresh();
    } catch (error) {
      const msg = (error as Error).message || "Failed to delete music!";
      toast.update(toastLoading, {
        render: msg,
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
      setOpen && setOpen(false);
      console.error(error);
    }
  }, [fetcher, music.artist.id, music.id, pathname, router, setOpen]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Music</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete the music{" "}
            <span className="font-bold">{music.title}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-2 w-full flex-row items-center justify-end space-x-2">
          <AlertDialogCancel className="mt-0 w-fit">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteMusic()} className="w-fit">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
