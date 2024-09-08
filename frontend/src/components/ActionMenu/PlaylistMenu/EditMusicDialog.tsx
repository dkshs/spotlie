"use client";

import type { PlaylistPropsWithMusics } from "@/utils/types";

import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { PencilSimple, Spinner, X } from "@phosphor-icons/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { InputFile } from "@/components/ui/InputFile";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { useApi } from "@/hooks/useApi";

export interface EditPlaylistDialogProps extends React.PropsWithChildren {
  readonly playlist: PlaylistPropsWithMusics;
  readonly open?: boolean;
  readonly setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface DataType {
  name: string;
  description?: string;
  image: File | null;
}

export function EditPlaylistDialog({
  playlist,
  children,
  setOpen,
  open = false,
}: EditPlaylistDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataType>({ ...playlist, image: null });
  const [imgChanged, setImgChanged] = useState(false);
  const [imgPreview, setImgPreview] = useState<string | undefined>(
    playlist.image,
  );
  const { fetcher } = useApi();

  const dataChanged = useMemo(() => {
    return (
      data.name !== playlist.name ||
      data.description !== playlist.description ||
      imgChanged
    );
  }, [data, imgChanged, playlist]);

  const updatePlaylist = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      setLoading(true);
      e.preventDefault();
      if (!dataChanged) {
        setLoading(false);
        setOpen && setOpen(false);
        return;
      }
      const toastLoading = toast.loading("Updating...");
      const pl = {
        name: data.name,
        description: data.description || "",
        update_image: imgChanged,
      };
      const formData = new FormData();
      formData.append("playlist", JSON.stringify(pl));
      formData.append("image", data.image || "");
      try {
        await fetcher(`/playlists/${playlist.id}`, {
          method: "PATCH",
          needAuth: true,
          body: formData,
        });
        toast.update(toastLoading, {
          render: "Playlist updated!",
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
      setOpen && setOpen(false);
      setLoading(false);
    },
    [data, dataChanged, fetcher, imgChanged, playlist.id, router, setOpen],
  );

  const handleImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImgChanged(true);

      setImgPreview(URL.createObjectURL(file));
      setData((prev) => ({ ...prev, image: file }));
    }
    setLoading(false);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <form onSubmit={(e) => updatePlaylist(e)}>
          <DialogHeader>
            <DialogTitle>Edit details</DialogTitle>
            <DialogDescription>
              Make changes to your playlist here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex flex-col gap-4 md:flex-row">
            <div className="group relative size-44 self-center rounded-lg bg-background bg-gradient-to-tr from-background/60 to-primary/20 shadow-lg shadow-background/60">
              {imgPreview ? (
                <Image
                  src={imgPreview}
                  alt={playlist.name}
                  className="aspect-square object-cover"
                  fill
                />
              ) : null}
              <InputFile
                id="image"
                variant="none"
                name="image"
                accept="image/*"
                onChange={handleImage}
                className="absolute inset-0 z-10 flex size-full flex-col items-center justify-center gap-3 bg-black/50 p-0 opacity-0 outline-none duration-200 focus-within:opacity-100 group-hover:opacity-100 group-focus:opacity-100"
                labelText={
                  <div className="-mt-3 flex size-full flex-col items-center justify-center gap-3">
                    <PencilSimple weight="bold" size={40} />
                    <span>Choose photo</span>
                  </div>
                }
                tooltipContent={"Choose photo"}
              />
              {imgPreview ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="absolute right-0 top-0 z-20 opacity-0 duration-200 hover:scale-100 focus:opacity-100 group-hover:opacity-100 group-focus:opacity-100"
                        radius="full"
                        variant="destructive"
                        onClick={() => {
                          if (playlist.image) {
                            setImgChanged(true);
                          }
                          setImgPreview(undefined);
                          setData((prev) => ({ ...prev, image: null }));
                        }}
                        size="icon"
                        type="button"
                      >
                        <X weight="bold" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete image</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : null}
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Add a name"
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  value={data.name}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Add an optional description"
                  defaultValue={playlist.description}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="submit" disabled={!dataChanged || loading}>
              {loading ? (
                <Spinner className="animate-spin" size={18} weight="bold" />
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
