"use client";

import { useMusic } from "@/hooks/useMusic";
import { useWindowSize } from "usehooks-ts";

import * as SliderPrimitive from "@radix-ui/react-slider";
import Image from "next/image";
import Link from "next/link";
import { MusicControls } from "./MusicControls";
import { VolumeControls } from "./VolumeControls";

export function Player() {
  const { width } = useWindowSize();
  const { currentMusic, musicTime, handleMusicTime } = useMusic();

  if (!currentMusic) return null;

  return (
    <div className="group/player fixed inset-x-0 bottom-0 z-[9999] h-16 border-t bg-card/95 backdrop-blur-xl sm:h-20">
      <SliderPrimitive.Root
        className="relative flex w-full touch-none select-none items-center"
        max={100}
        value={[musicTime.progress]}
        step={1}
        aria-label="Music Progress"
        onValueChange={(v) => handleMusicTime(v[0] || 0)}
      >
        <div className="absolute flex h-4 w-full cursor-pointer items-center">
          <SliderPrimitive.Track className="absolute h-0.5 w-full grow cursor-pointer overflow-hidden rounded-full bg-secondary">
            <SliderPrimitive.Range className="absolute h-full rounded-full bg-foreground/60 group-focus-within/player:bg-foreground/80 group-hover/player:bg-foreground/80" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb className="block h-3.5 w-3.5 cursor-grab rounded-full bg-foreground opacity-0 ring-offset-background duration-200 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 active:cursor-grabbing group-focus-within/player:opacity-100 group-hover/player:opacity-100" />
        </div>
      </SliderPrimitive.Root>
      <div className="mx-auto flex size-full max-w-[1600px] items-center justify-between px-3 md:px-6">
        <div className="absolute inset-x-0 -top-6 mx-auto flex max-w-[1600px] translate-y-4 justify-between px-4 opacity-0 duration-300 group-focus-within/player:translate-y-0 group-focus-within/player:opacity-100 group-hover/player:translate-y-0 group-hover/player:opacity-100">
          <span className="text-xs opacity-75">{musicTime.currentTime}</span>
          <span className="text-xs opacity-75">{musicTime.duration}</span>
        </div>
        <div className="flex items-center gap-2 truncate">
          {currentMusic.image && (
            <Image
              src={currentMusic.image}
              alt={currentMusic.title}
              width={56}
              height={56}
              className="aspect-square size-12 rounded-md object-cover md:size-14"
            />
          )}
          <div className="flex flex-col">
            <Link
              className="truncate font-bold hover:underline md:text-lg"
              href={`/music/${currentMusic.id}`}
            >
              {currentMusic.title}
            </Link>
            <Link
              className="truncate text-sm text-foreground/60 hover:text-foreground hover:underline"
              href={`/artist/${currentMusic.artist.id}`}
            >
              {currentMusic.artist.full_name}
            </Link>
          </div>
        </div>
        <MusicControls />
        {width >= 620 && <VolumeControls />}
      </div>
    </div>
  );
}
