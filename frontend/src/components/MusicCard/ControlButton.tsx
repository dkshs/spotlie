"use client";

import type { MusicProps, PlaylistPropsWithMusics } from "@/utils/types";

import { useCallback, useMemo } from "react";
import { Pause, Play } from "@phosphor-icons/react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useMusic } from "@/hooks/useMusic";

interface ControlButtonProps {
  readonly music: MusicProps;
  readonly playlist?: PlaylistPropsWithMusics;
  readonly musics?: MusicProps[];
  readonly isPlaylistBtn?: boolean;
  readonly buttonFocus?: boolean;
  readonly radius?: "rounded-lg" | "rounded-full";
  readonly orientation?: "horizontal" | "vertical";
  readonly artistId?: string;
}

function ButtonContent({
  musicIsPlaying = false,
  buttonFocus = false,
  orientation = "vertical",
}: {
  readonly musicIsPlaying?: boolean;
  readonly buttonFocus?: boolean;
  readonly orientation?: "horizontal" | "vertical";
}) {
  return musicIsPlaying ? (
    <>
      <Image
        src="/musicPlaying.gif"
        alt="Music is playing"
        className={`${
          buttonFocus ? "hidden" : "flex"
        } group-hover:hidden group-focus/button:hidden group-focus:hidden`}
        height={24}
        width={24}
        unoptimized
      />
      <Pause
        size={24}
        weight="fill"
        className={`${buttonFocus ? "flex" : "hidden"} ${
          orientation === "horizontal" &&
          "duration-200 group-hover/button:text-primary"
        } group-hover:flex group-focus/button:flex group-focus:flex`}
      />
    </>
  ) : (
    <Play
      size={24}
      weight="fill"
      className={
        orientation === "horizontal"
          ? `${
              buttonFocus ? "scale-100" : "scale-0"
            } duration-200 group-hover:scale-100 group-hover/button:text-primary group-focus/button:scale-100`
          : ""
      }
    />
  );
}

export function ControlButton({
  music,
  playlist,
  musics,
  artistId,
  isPlaylistBtn = false,
  radius = "rounded-lg",
  buttonFocus = false,
  orientation = "vertical",
}: ControlButtonProps) {
  const {
    currentMusic,
    musicState,
    playMusic,
    pauseMusic,
    playlist: ctxPlaylist,
  } = useMusic();
  const artistIsPlaying = useMemo(
    () => (artistId ? currentMusic?.artist.id === artistId : false),
    [artistId, currentMusic?.artist?.id],
  );
  const playlistIsPlaying = useMemo(() => {
    if (playlist && isPlaylistBtn) {
      return (
        isPlaylistBtn &&
        playlist.name === ctxPlaylist?.name &&
        playlist.id === ctxPlaylist?.id
      );
    }
    return false;
  }, [ctxPlaylist?.id, ctxPlaylist?.name, isPlaylistBtn, playlist]);
  const musicIsPlaying = useMemo(
    () =>
      ((currentMusic?.id === music.id &&
        (playlist ? currentMusic?.order_id === music.order_id : true)) ||
        playlistIsPlaying ||
        artistIsPlaying) &&
      musicState === "playing",
    [
      artistIsPlaying,
      currentMusic?.id,
      currentMusic?.order_id,
      music.id,
      music.order_id,
      musicState,
      playlist,
      playlistIsPlaying,
    ],
  );
  const title = useMemo(() => {
    const state = musicIsPlaying ? "Pause" : "Play";
    const name = artistId ? music.artist.full_name : music.title;
    return `${state} ${name}`;
  }, [artistId, music.artist.full_name, music.title, musicIsPlaying]);

  const onClick = useCallback(() => {
    if (musicIsPlaying) {
      pauseMusic();
    } else {
      const song = artistIsPlaying && currentMusic ? currentMusic : music;
      playMusic({ music: song, otherPlaylist: playlist, musics });
    }
  }, [
    artistIsPlaying,
    currentMusic,
    music,
    musicIsPlaying,
    musics,
    pauseMusic,
    playMusic,
    playlist,
  ]);

  return orientation === "vertical" ? (
    <Button
      type="button"
      className={`group/button absolute bottom-0 right-0 z-20 mb-2 mr-3 size-12 ${
        musicIsPlaying ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } focus:translate-y-0 focus:opacity-100 group-hover:translate-y-0 group-hover:opacity-100`}
      radius="full"
      size="icon"
      title={title}
      onClick={() => onClick()}
    >
      <ButtonContent
        musicIsPlaying={musicIsPlaying}
        buttonFocus={buttonFocus}
        orientation={orientation}
      />
    </Button>
  ) : (
    <button
      type="button"
      className={`group/button absolute inset-0 z-20 flex size-full items-center justify-center ${radius} border-2 border-transparent bg-black/50 ${
        musicIsPlaying || buttonFocus ? "opacity-100" : "opacity-0"
      } duration-200 focus:opacity-100 focus:outline-none focus-visible:border-primary group-hover:opacity-100`}
      onClick={() => onClick()}
      title={title}
      aria-label={title}
    >
      <ButtonContent
        musicIsPlaying={musicIsPlaying}
        buttonFocus={buttonFocus}
        orientation={orientation}
      />
    </button>
  );
}
