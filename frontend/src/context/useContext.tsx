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
  isShuffle: boolean;
  musics: MusicProps[];
  playMusic: (music: MusicProps, musics?: MusicProps[]) => void;
  pauseMusic: () => void;
  repeatMusic: () => void;
  shuffleMusics: () => void;
  skipMusic: () => void;
  previousMusic: () => void;
}

const ctxInitialValues: MusicContextProps = {
  currentMusic: null,
  musicState: "paused",
  time: { currentTime: "00:00", duration: "00:00", percentage: 0 },
  isRepeat: false,
  isShuffle: false,
  musics: [],
  playMusic: (music: MusicProps, musics?: MusicProps[]): void => {
    throw new Error("playMusic() not implemented.");
  },
  pauseMusic: (): void => {
    throw new Error("pauseMusic() not implemented.");
  },
  repeatMusic: (): void => {
    throw new Error("repeatMusic() not implemented.");
  },
  shuffleMusics: (): void => {
    throw new Error("shuffleMusics() not implemented.");
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
  const [isShuffle, setIsShuffle] = useState(false);
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
  const [localMusicShuffle, setLocalMusicShuffle] = useLocalStorage(
    "shuffleMusic",
    false,
  );

  const getMusics = useCallback(async () => {
    try {
      const { data } = await api.get("/musics");
      setMusics(data);
    } catch (err) {
      setMusics([]);
    }
  }, []);

  useEffect(() => {
    getMusics();
  }, [getMusics]);

  useEffect(() => {
    if (localMusicRepeat) {
      setIsRepeat(true);
    } else {
      setIsRepeat(false);
    }
    if (localMusicShuffle) {
      setIsShuffle(true);
    } else {
      setIsShuffle(false);
    }
  }, [localMusicRepeat, localMusicShuffle]);

  const verifyMusic = useCallback(
    async (music: MusicProps | null) => {
      if (music) {
        try {
          // if (music.id !== currentMusic?.id) {
          const { data } = await api.get(`/music/${music.id}`);
          if (data) {
            setCurrentMusic(data);
          } else {
            setCurrentMusic(null);
          }
          // }
        } catch (e) {
          setCurrentMusic(null);
          setLocalCurrentMusic(null);
        }
      }
    },
    [setLocalCurrentMusic],
  );

  useEffect(() => {
    verifyMusic(localCurrentMusic);
  }, [localCurrentMusic, verifyMusic]);

  const playMusic = useCallback(
    async (music: MusicProps, musics?: MusicProps[]) => {
      if (!music) return;
      if (musics) {
        setMusics(musics);
      } else {
        getMusics();
      }
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
    [musicAudio, getMusics, setLocalCurrentMusic],
  );

  const pauseMusic = useCallback(() => {
    musicAudio?.pause();
    setMusicState("paused");
  }, [musicAudio]);

  const skipMusic = useCallback(async () => {
    const randomIndex = Number(
      String(Math.random() * musics.length - 1).split(".")[0],
    );
    if (isShuffle) {
      playMusic(musics[randomIndex], musics);
    } else {
      for (let i = 0; i < musics.length; i++) {
        const song = musics[i];
        if (song.id === currentMusic?.id) {
          playMusic(musics[musics.length - 1 === i ? 0 : i + 1], musics);
        }
      }
    }
  }, [currentMusic, isShuffle, musics, playMusic]);

  const previousMusic = useCallback(async () => {
    for (let i = 0; i < musics.length; i++) {
      const song = musics[i];
      if (song.id === currentMusic?.id) {
        playMusic(musics[i === 0 ? musics.length - 1 : i - 1], musics);
      }
    }
  }, [currentMusic, musics, playMusic]);

  const addEvents = useCallback(() => {
    musicAudio?.addEventListener("play", () => setMusicState("playing"));
    musicAudio?.addEventListener("pause", () => setMusicState("paused"));
  }, [musicAudio]);

  const musicUpdateTime = useCallback(() => {
    if (musicAudio) {
      const musicDuration = musicAudio.duration;
      const musicCurrentTime = musicAudio.currentTime;
      const musicProgress = (musicCurrentTime * 100) / musicDuration;

      setTime({
        currentTime: musicTimeFormatter(musicAudio).musicCurrentTime,
        duration: musicTimeFormatter(musicAudio).musicDurationTime,
        percentage: Number(musicProgress.toFixed(0)),
      });
    }
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
    musicAudio?.addEventListener("timeupdate", musicUpdateTime);
    musicAudio?.addEventListener("ended", musicEnded);
    return () => {
      musicAudio?.removeEventListener("ended", musicEnded);
      musicAudio?.removeEventListener("timeupdate", musicUpdateTime);
    };
  }, [
    addEvents,
    currentMusic,
    isRepeat,
    musicAudio,
    musicUpdateTime,
    playMusic,
    skipMusic,
  ]);

  const repeatMusic = useCallback(() => {
    if (isRepeat) {
      setIsRepeat(false);
      setLocalMusicRepeat(false);
    } else {
      setIsRepeat(true);
      setLocalMusicRepeat(true);
    }
  }, [isRepeat, setLocalMusicRepeat]);

  const shuffleMusics = useCallback(() => {
    if (isShuffle) {
      setIsShuffle(false);
      setLocalMusicShuffle(false);
    } else {
      setIsShuffle(true);
      setLocalMusicShuffle(true);
    }
  }, [isShuffle, setLocalMusicShuffle]);

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
        isShuffle,
        shuffleMusics,
        musics,
      }}
    >
      {props.children}
    </MusicContext.Provider>
  );
}
