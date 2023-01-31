import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "usehooks-ts";
import { api } from "@/lib/axios";
import { musicTimeFormatter } from "@/utils/formatter";

import type { MusicProps } from "@/utils/types";

type MusicStateProps = "playing" | "paused";
interface MusicTimeProps {
  currentTime: string;
  duration: string;
  percentage: number;
}

interface MusicContextProps {
  currentMusic: MusicProps | null;
  musicState: MusicStateProps;
  time: MusicTimeProps;
  playMusic: (music: MusicProps) => void;
  pauseMusic: () => void;
}

const ctxInitialValues: MusicContextProps = {
  currentMusic: null,
  musicState: "paused",
  time: { currentTime: "0:00", duration: "0:00", percentage: 0 },
  playMusic: (music: MusicProps): void => {
    throw new Error("playMusic() not implemented.");
  },
  pauseMusic: (): void => {
    throw new Error("pauseMusic() not implemented.");
  },
};

export const MusicContext = createContext<MusicContextProps>(ctxInitialValues);

export function MusicContextProvider(props: PropsWithChildren) {
  const [musicState, setMusicState] = useState<MusicStateProps>(
    ctxInitialValues.musicState,
  );
  const [time, setTime] = useState<MusicTimeProps>(ctxInitialValues.time);
  const [currentMusic, setCurrentMusic] = useState<MusicProps | null>(null);
  const [localCurrentMusic, setLocalCurrentMusic] =
    useLocalStorage<MusicProps | null>("currentMusic", null);
  const [musicAudio, setMusicAudio] = useState<HTMLAudioElement | null>(null);

  const saveOrDeleteMusic = useCallback(
    (music: MusicProps | null) => {
      if (music) {
        setCurrentMusic(music);
        setLocalCurrentMusic(music);
      } else {
        setCurrentMusic(null);
        setLocalCurrentMusic(null);
        setMusicAudio(null);
      }
    },
    [setLocalCurrentMusic],
  );

  const { data: music } = useQuery<MusicProps>({
    queryKey: ["music-verification"],
    queryFn: async () => {
      if (localCurrentMusic) {
        const { data } = await api.get(`/music/${localCurrentMusic.id}`);
        return data;
      }
      return null;
    },
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    saveOrDeleteMusic(music || null);
  }, [music, saveOrDeleteMusic]);

  useEffect(() => {
    musicAudio?.addEventListener("timeupdate", () => {
      const musicDuration = musicAudio.duration;
      const musicCurrentTime = musicAudio.currentTime;
      const musicProgress = (musicCurrentTime * 100) / musicDuration;

      setTime({
        currentTime: musicTimeFormatter(musicAudio).musicCurrentTime,
        duration: musicTimeFormatter(musicAudio).musicDurationTime,
        percentage: musicProgress,
      });
    });
  }, [musicAudio]);

  const playMusic = useCallback(
    (music: MusicProps) => {
      saveOrDeleteMusic(music);
      if (musicAudio) {
        musicAudio.pause();
      }
      if (musicAudio && musicAudio.src === music.audio) {
        musicAudio.play();
      } else {
        const audio = new Audio();
        audio.src = music.audio;
        setMusicAudio(audio);
        audio.play();
      }
      setMusicState("playing");
    },
    [musicAudio, saveOrDeleteMusic],
  );

  const pauseMusic = useCallback(() => {
    musicAudio?.pause();
    setMusicState("paused");
  }, [musicAudio]);

  return (
    <MusicContext.Provider
      value={{ currentMusic, playMusic, pauseMusic, musicState, time }}
    >
      {props.children}
    </MusicContext.Provider>
  );
}
