"use client";

import { useEffect, useState } from "react";

import { musicTimeFormatter } from "@/utils/formatters";

export function MusicDuration({ src }: { src: string }) {
  const [musicDuration, setMusicDuration] = useState("");

  useEffect(() => {
    const audio = new Audio(src);
    audio.onloadedmetadata = () => {
      let duration = musicTimeFormatter(audio).musicDurationTime;
      duration.charAt(0) === "0" && (duration = duration.slice(1));
      setMusicDuration(duration);
    };
  }, [src]);

  return <span>{musicDuration}</span>;
}
