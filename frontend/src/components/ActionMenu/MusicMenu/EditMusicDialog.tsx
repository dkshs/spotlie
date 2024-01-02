"use client";

import type { MusicProps } from "@/utils/types";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";

import { toast } from "react-toastify";
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
import { Button } from "@/components/ui/Button";
import { InputFile } from "@/components/ui/InputFile";

import { PencilSimple, Spinner, X } from "@phosphor-icons/react";

export interface EditMusicDialogProps extends React.PropsWithChildren {
  music: MusicProps;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface DataType {
  title: string;
  release_date?: Date;
  image: File | null;
  audio: File | null;
}

export function EditMusicDialog({
  music,
  children,
  setOpen,
  open = false,
}: EditMusicDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataType>({
    title: music.title,
    release_date: music.release_date,
    image: null,
    audio: null,
  });
  const [imgChanged, setImgChanged] = useState(false);
  const [imgPreview, setImgPreview] = useState<string | undefined>(music.image);
  const { fetcher } = useApi();

  const dataChanged = useMemo(() => {
    return (
      data.title !== music.title ||
      data.release_date !== music.release_date ||
      data.audio !== null ||
      imgChanged
    );
  }, [data, imgChanged, music]);

  const updateMusic = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      setLoading(true);
      e.preventDefault();
      if (!dataChanged) {
        setLoading(false);
        setOpen && setOpen(false);
        return;
      }
      const toastLoading = toast.loading("Updating...");
      const m = {
        title: data.title,
        release_date: data.release_date || null,
        update_image: imgChanged,
      };
      const formData = new FormData();
      formData.append("music", JSON.stringify(m));
      formData.append("image", data.image || "");
      formData.append("audio", data.audio || "");
      try {
        await fetcher(`/musics/${music.id}`, {
          method: "PATCH",
          needAuth: true,
          body: formData,
        });
        toast.update(toastLoading, {
          render: "Music updated!",
          type: "success",
          isLoading: false,
          autoClose: 1000,
        });
        router.refresh();
      } catch (error) {
        const msg = (error as Error).message || "Failed to update music!";
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
    [data, dataChanged, fetcher, imgChanged, music.id, router, setOpen],
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
        <form onSubmit={(e) => updateMusic(e)}>
          <DialogHeader>
            <DialogTitle>Edit details</DialogTitle>
            <DialogDescription>
              Make changes to your music here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex flex-col gap-4 md:flex-row">
            <div className="group relative size-44 self-center rounded-lg bg-background bg-gradient-to-tr from-background/60 to-primary/20 shadow-lg shadow-background/60">
              {imgPreview && (
                <Image
                  src={imgPreview}
                  alt={music.title}
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
                    <span>Choose image</span>
                  </div>
                }
                tooltipContent={"Choose image"}
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
                          if (music.image) {
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
              )}
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  name="title"
                  placeholder="Add a title"
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  value={data.title}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="release_date">Release date</Label>
                <Input
                  id="release_date"
                  name="release_date"
                  type="date"
                  placeholder="Add an optional release date"
                  value={
                    data.release_date
                      ? new Date(data.release_date).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      release_date: new Date(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <InputFile
                  id="audio"
                  variant="ghost"
                  name="audio"
                  accept="audio/*"
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      audio: e.target.files![0] || null,
                    }))
                  }
                  className="scale-100 border border-input hover:scale-100"
                  labelText={
                    <div className="-mt-3 flex size-full flex-col items-center justify-center gap-3">
                      <PencilSimple weight="bold" size={40} />
                      <span>Choose audio</span>
                    </div>
                  }
                  tooltipContent={"Choose audio"}
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
