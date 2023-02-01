import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
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
  isRepeat: boolean;
  playMusic: (music: MusicProps) => void;
  pauseMusic: () => void;
  repeatMusic: () => void;
  skipMusic: () => void;
  previousMusic: () => void;
}

const ctxInitialValues: MusicContextProps = {
  currentMusic: null,
  musicState: "paused",
  time: { currentTime: "00:00", duration: "00:00", percentage: 0 },
  isRepeat: false,
  playMusic: (music: MusicProps): void => {
    throw new Error("playMusic() not implemented.");
  },
  pauseMusic: (): void => {
    throw new Error("pauseMusic() not implemented.");
  },
  repeatMusic: (): void => {
    throw new Error("repeatMusic() not implemented.");
  },
  skipMusic: (): void => {
    throw new Error("skipMusic() not implemented.");
  },
  previousMusic: (): void => {
    throw new Error("previousMusic() not implemented.");
  },
};

export const MusicContext = createContext<MusicContextProps>(ctxInitialValues);

export function MusicContextProvider(props: PropsWithChildren) {
  const [musics, setMusics] = useState<MusicProps[] | []>([]);
  const [musicState, setMusicState] = useState<MusicStateProps>("paused");
  const [isRepeat, setIsRepeat] = useState(false);
  const [time, setTime] = useState<MusicTimeProps>(ctxInitialValues.time);
  const [currentMusic, setCurrentMusic] = useState<MusicProps | null>(null);
  const [musicAudio, setMusicAudio] = useState<HTMLAudioElement | undefined>(
    typeof Audio !== "undefined" ? new Audio("") : undefined,
  );

  const [localCurrentMusic, setLocalCurrentMusic] =
    useLocalStorage<MusicProps | null>("currentMusic", null);
  const [localMusicRepeat, setLocalMusicRepeat] = useLocalStorage(
    "repeatMusic",
    false,
  );

  useEffect(() => {
    const getMusics = async () => {
      try {
        const { data } = await api.get("/musics");
        setMusics(data);
      } catch (err) {
        setMusics([]);
      }
    };
    getMusics();
  }, []);

  useEffect(() => {
    if (localMusicRepeat) {
      setIsRepeat(true);
    } else {
      setIsRepeat(false);
    }
  }, [localMusicRepeat]);

  const verifyMusic = useCallback(
    async (music: MusicProps | null) => {
      if (music) {
        try {
          if (music.id !== currentMusic?.id) {
            const { data } = await api.get(`/music/${music.id}`);
            if (data) {
              setCurrentMusic(data);
            } else {
              setCurrentMusic(null);
            }
          }
        } catch (e) {
          setCurrentMusic(null);
          setLocalCurrentMusic(null);
        }
      }
    },
    [currentMusic, setLocalCurrentMusic],
  );

  useEffect(() => {
    verifyMusic(localCurrentMusic);
  }, [localCurrentMusic, verifyMusic]);

  const playMusic = useCallback(
    async (music: MusicProps) => {
      setLocalCurrentMusic(music);
      setCurrentMusic(music);

      if (musicAudio?.src === music.audio) {
        musicAudio.play();
      } else {
        musicAudio?.pause();
        const audio = new Audio();
        audio.preload = "metadata";
        audio.src = music.audio;
        setMusicAudio(audio);
        audio.play();
      }
      setMusicState("playing");
    },
    [setLocalCurrentMusic, musicAudio],
  );

  const pauseMusic = useCallback(() => {
    musicAudio?.pause();
    setMusicState("paused");
  }, [musicAudio]);

  const skipMusic = useCallback(async () => {
    for (let i = 0; i < musics.length; i++) {
      const song = musics[i];
      if (song.id === currentMusic?.id) {
        playMusic(musics[musics.length - 1 === i ? 0 : i + 1]);
      }
    }
  }, [currentMusic, musics, playMusic]);

  const previousMusic = useCallback(async () => {
    for (let i = 0; i < musics.length; i++) {
      const song = musics[i];
      if (song.id === currentMusic?.id) {
        playMusic(musics[i === 0 ? musics.length - 1 : i - 1]);
      }
    }
  }, [currentMusic, musics, playMusic]);

  const addEvents = useCallback(() => {
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
    musicAudio?.addEventListener("play", () => setMusicState("playing"));
    musicAudio?.addEventListener("pause", () => setMusicState("paused"));
  }, [musicAudio]);

  useEffect(() => {
    addEvents();
    const musicEnded = () => {
      if (isRepeat) {
        playMusic(currentMusic!);
      } else {
        skipMusic();
      }
    };
    musicAudio?.addEventListener("ended", musicEnded);
    return () => {
      musicAudio?.removeEventListener("ended", musicEnded);
    };
  }, [addEvents, currentMusic, isRepeat, musicAudio, playMusic, skipMusic]);

  const repeatMusic = useCallback(() => {
    setIsRepeat(!localMusicRepeat);
    setLocalMusicRepeat(!isRepeat);
  }, [isRepeat, localMusicRepeat, setLocalMusicRepeat]);

  return (
    <MusicContext.Provider
      value={{
        currentMusic,
        playMusic,
        pauseMusic,
        musicState,
        time,
        isRepeat,
        repeatMusic,
        skipMusic,
        previousMusic,
      }}
    >
      {props.children}
    </MusicContext.Provider>
  );
}
