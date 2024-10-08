"use client";

import type { PlaylistPropsWithMusics } from "@/utils/types";

import { useCallback } from "react";
import { toast } from "react-toastify";
import { usePathname, useRouter } from "next/navigation";
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
import { useApi } from "@/hooks/useApi";

export interface DeletePlaylistDialogProps extends React.PropsWithChildren {
  readonly playlist: PlaylistPropsWithMusics;
  readonly open?: boolean;
  readonly setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DeletePlaylistDialog({
  playlist,
  children,
  setOpen,
  open = false,
}: DeletePlaylistDialogProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { fetcher } = useApi();

  const deletePlaylist = useCallback(async () => {
    const toastLoading = toast.loading("Deleting playlist...");
    try {
      let redirectUrl = null;
      if (pathname.startsWith("/playlist/")) {
        redirectUrl = `${playlist.owner_is_artist ? "/artist" : "/user"}/${
          playlist.owner.id
        }`;
      }
      await fetcher(`/playlists/${playlist.id}`, {
        method: "DELETE",
        needAuth: true,
      });
      toast.update(toastLoading, {
        render: "Playlist deleted!",
        type: "success",
        isLoading: false,
        autoClose: 1000,
      });
      redirectUrl && router.push(redirectUrl);
      router.refresh();
    } catch (error) {
      const msg = (error as Error).message || "Failed to delete playlist!";
      toast.update(toastLoading, {
        render: msg,
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
      setOpen && setOpen(false);
      console.error(error);
    }
  }, [
    fetcher,
    pathname,
    playlist.id,
    playlist.owner.id,
    playlist.owner_is_artist,
    router,
    setOpen,
  ]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete from Your Library?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete <span className="font-bold">{playlist.name}</span>{" "}
            from <span className="font-bold">Your Library</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-2 w-full flex-row items-center justify-end space-x-2">
          <AlertDialogCancel className="mt-0 w-fit">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deletePlaylist()} className="w-fit">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
