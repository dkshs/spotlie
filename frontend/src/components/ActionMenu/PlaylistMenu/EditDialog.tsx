"use client";

import type { PlaylistPropsWithMusics } from "@/utils/types";

import { ChangeEvent, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { InputFile } from "@/components/ui/InputFile";

import { PencilSimple, X } from "@phosphor-icons/react";

export interface EditDialogProps extends React.PropsWithChildren {
  playlist: PlaylistPropsWithMusics;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function EditDialog({
  playlist,
  children,
  setOpen,
  open = false,
}: EditDialogProps) {
  const router = useRouter();
  const [imgChanged, setImgChanged] = useState(false);
  const [imgPreview, setImgPreview] = useState<string | undefined>(
    playlist.image,
  );
  const [image, setImage] = useState<File | null>(null);
  const { fetcher } = useApi();

  const updatePlaylist = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      const pl = {
        name: data.get("name"),
        description: data.get("description"),
        update_image: imgChanged,
      };
      if (
        !imgChanged &&
        !image &&
        playlist.name === pl.name &&
        playlist.description === pl.description
      ) {
        return;
      }
      data.append("playlist", JSON.stringify(pl));
      if (!imgChanged) {
        data.delete("image");
      } else {
        data.delete("image");
        data.append("image", image || "");
      }
      try {
        await fetcher(`/playlists/${playlist.id}`, {
          method: "PATCH",
          needAuth: true,
          body: data,
        });
        router.refresh();
      } catch (error) {
        console.log(error);
      }
      setOpen && setOpen(false);
    },
    [
      fetcher,
      image,
      imgChanged,
      playlist.description,
      playlist.id,
      playlist.name,
      router,
      setOpen,
    ],
  );

  const handleImage = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]?.type.startsWith("image/")) {
      setImgChanged(true);
      setImgPreview(URL.createObjectURL(e.target.files[0]));
      setImage(e.target.files[0]);
    }
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
              {imgPreview && (
                <Image
                  src={imgPreview}
                  alt={playlist.name}
                  className="aspect-square object-cover"
                  fill
                />
              )}
              <InputFile
                id="image"
                variant="none"
                name="image"
                accept="image/*"
                onChange={handleImage}
                className="absolute inset-0 z-10 flex size-full flex-col items-center justify-center gap-3 bg-black/50 px-0 py-0 opacity-0 outline-none duration-200 focus-within:opacity-100 group-hover:opacity-100 group-focus:opacity-100"
                labelText={
                  <div className="-mt-3 flex size-full flex-col items-center justify-center gap-3">
                    <PencilSimple weight="bold" size={40} />
                    <span>Choose photo</span>
                  </div>
                }
                tooltipContent={"Choose photo"}
              />
              {imgPreview && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="absolute right-0 top-0 z-20 opacity-0 duration-200 hover:scale-100 focus:opacity-100 group-hover:opacity-100 group-focus:opacity-100"
                        radius="full"
                        variant="destructive"
                        onClick={() => {
                          setImgChanged(true);
                          setImgPreview(undefined);
                          setImage(null);
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
              )}
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Add a name"
                  defaultValue={playlist.name}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Add an optional description"
                  defaultValue={playlist.description}
                ></Textarea>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
