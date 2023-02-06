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
  durationNumber: number;
  percentage: number;
}

interface MusicContextProps {
  currentMusic: MusicProps | null;
  musicState: MusicStateProps;
  time: MusicTimeProps;
  isRepeat: boolean;
  isShuffle: boolean;
  isMuted: boolean;
  musicVolume: number;
  musics: MusicProps[];
  playMusic: (music: MusicProps, musics?: MusicProps[]) => void;
  pauseMusic: () => void;
  repeatMusic: () => void;
  shuffleMusics: () => void;
  skipMusic: () => void;
  previousMusic: () => void;
  handleMusicVolume: (value?: number) => void;
  handleMusicTime: (value: number) => void;
}

const ctxInitialValues: MusicContextProps = {
  currentMusic: null,
  musicState: "paused",
  time: {
    currentTime: "00:00",
    duration: "00:00",
    percentage: 0,
    durationNumber: 0,
  },
  isRepeat: false,
  isShuffle: false,
  isMuted: false,
  musics: [],
  musicVolume: 1,
  playMusic: (): void => {
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
  handleMusicVolume: (): void => {
    throw new Error("handleMusicVolume() not implemented.");
  },
  handleMusicTime: (): void => {
    throw new Error("handleMusicTime() not implemented.");
  },
};

export const MusicContext = createContext<MusicContextProps>(ctxInitialValues);

export function MusicContextProvider(props: PropsWithChildren) {
  const [musics, setMusics] = useState<MusicProps[] | []>([]);
  const [musicState, setMusicState] = useState<MusicStateProps>("paused");
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [musicVolume, setMusicVolume] = useState(1);
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

  useQuery<MusicProps | null>({
    queryKey: ["verify-music"],
    queryFn: async () => {
      try {
        if (localCurrentMusic) {
          const { data } = await api.get(`/music/${localCurrentMusic.id}`);
          if (data) {
            setCurrentMusic(data);
            setLocalCurrentMusic(data);
            const audio = new Audio(data.audio);
            audio.onloadedmetadata = () => {
              const duration = audio.duration;
              const { musicDurationTime } = musicTimeFormatter(audio);

              setMusicAudio(audio);
              setTime((prev) => {
                return {
                  ...prev,
                  duration: musicDurationTime,
                  durationNumber: duration,
                };
              });
            };
          } else {
            throw Error("");
          }
          return data || null;
        } else {
          throw Error("");
        }
      } catch (err) {
        setCurrentMusic(null);
        setLocalCurrentMusic(null);
        return null;
      }
    },
    refetchOnWindowFocus: false,
  });

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

  const skipMusic = useCallback(() => {
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * musics.length - 1);
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

  const previousMusic = useCallback(() => {
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

  const updateMusicTime = useCallback(() => {
    if (musicAudio) {
      const musicDuration = musicAudio.duration;
      const musicCurrentTime = musicAudio.currentTime;
      const musicProgress = (musicCurrentTime * 100) / musicDuration;
      const { musicCurrentTime: musicCurrentTimeFormatted, musicDurationTime } =
        musicTimeFormatter(musicAudio);

      setTime({
        currentTime: musicCurrentTimeFormatted,
        duration: musicDurationTime,
        percentage: Math.floor(musicProgress),
        durationNumber: musicDuration,
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
    musicAudio?.addEventListener("timeupdate", updateMusicTime);
    musicAudio?.addEventListener("ended", musicEnded);
    return () => {
      musicAudio?.removeEventListener("ended", musicEnded);
      musicAudio?.removeEventListener("timeupdate", updateMusicTime);
    };
  }, [
    addEvents,
    currentMusic,
    isRepeat,
    musicAudio,
    updateMusicTime,
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

  const handleMusicVolume = useCallback(
    (value?: number) => {
      if (value && musicAudio) {
        musicAudio.volume = value;
        setMusicVolume(musicAudio.volume);
      }
      if (!value && musicAudio && musicAudio.volume > 0) {
        musicAudio.volume = 0;
        setMusicVolume(0);
        setIsMuted(true);
      } else if (!value && musicAudio) {
        musicAudio.volume = 1;
        setMusicVolume(1);
        setIsMuted(false);
      } else {
        setIsMuted(false);
      }
    },
    [musicAudio],
  );

  const handleMusicTime = useCallback(
    (value: number) => {
      if (musicAudio) {
        const time = (value / 100) * musicAudio.duration || 0;
        musicAudio.currentTime = time;
      }
    },
    [musicAudio],
  );

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
        handleMusicVolume,
        isMuted,
        handleMusicTime,
        musicVolume,
      }}
    >
      {props.children}
    </MusicContext.Provider>
  );
}
