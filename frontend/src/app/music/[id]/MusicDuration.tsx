"use client";

import { useEffect, useState } from "react";

import { musicTimeFormatter } from "@/utils/formatters";

export function MusicDuration({ src }: { src: string }) {
  const [musicDuration, setMusicDuration] = useState<{
    min: string;
    sec: string;
  } | null>(null);

  useEffect(() => {
    const audio = new Audio(src);
    audio.onloadedmetadata = () => {
      const duration = musicTimeFormatter(audio).musicDurationTime.split(":");
      let min = duration[0] || "00";
      let sec = duration[1] || "00";
      if (min === "00" && sec === "00") return;
      min = min.charAt(0) === "0" ? min.slice(1) : min;
      sec = sec.charAt(0) === "0" ? sec.slice(1) : sec;
      setMusicDuration({ min, sec });
    };
  }, [src]);

  return (
    musicDuration && (
      <span>
        {musicDuration.min} min {musicDuration.sec} sec
      </span>
    )
  );
}
