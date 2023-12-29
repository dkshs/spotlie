"use client";

import { useMusic } from "@/hooks/useMusic";

import { Button } from "../ui/Button";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { SpeakerHigh, SpeakerSimpleSlash } from "@phosphor-icons/react";

export function VolumeControls() {
  const { handleMusicVolume, musicVolume, mutatedMusic } = useMusic();

  return (
    <div className="group flex gap-1 md:gap-3">
      <Button
        radius="full"
        variant="ghost"
        size="icon"
        className="size-8 scale-100 md:size-10"
        onClick={() => handleMusicVolume()}
      >
        {mutatedMusic ? (
          <SpeakerSimpleSlash weight="bold" size={18} />
        ) : (
          <SpeakerHigh weight="bold" size={18} />
        )}
      </Button>
      <SliderPrimitive.Root
        className="relative flex w-20 touch-none select-none items-center"
        max={1}
        value={[musicVolume]}
        step={0.1}
        onValueChange={(v) => handleMusicVolume(v[0])}
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-secondary">
          <SliderPrimitive.Range className="absolute h-full bg-foreground/80 group-focus-within:bg-primary group-hover:bg-primary" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-3.5 w-3.5 rounded-full bg-foreground opacity-0 ring-offset-background duration-200 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group-focus-within:opacity-100 group-hover:opacity-100" />
      </SliderPrimitive.Root>
    </div>
  );
}
