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

import type {
  MusicContextProps,
  MusicStateProps,
  MusicTimeProps,
} from "./types";
import type { MusicProps } from "@/utils/types";

import { musicTimeFormatter } from "@/utils/formatters";

const ctxInitialValues: MusicContextProps = {
  currentMusic: null,
  musicState: "paused",
  musicTime: {
    currentTime: "00:00",
    currentTimeNum: 0,
    duration: "00:00",
    durationNum: 0,
    progress: 0,
  },
  musicVolume: 1,
  repeatMusic: false,
  shufflePlaylist: false,
  mutatedMusic: false,
  playlist: [],
  DBPlaylist: [],
  playMusic: (): void => {
    throw new Error("playMusic() not implemented.");
  },
  pauseMusic: (): void => {
    throw new Error("pauseMusic() not implemented.");
  },
  toggleRepeatMusic: (): void => {
    throw new Error("toggleRepeatMusic() not implemented.");
  },
  toggleShufflePlaylist: (): void => {
    throw new Error("toggleShufflePlaylist() not implemented.");
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
  const [playlist, setPlaylist] = useState<MusicProps[]>([]);
  const [currentMusic, setCurrentMusic] = useState<MusicProps | null>(null);
  const [musicStateAux, setMusicStateAux] = useState(0);
  const [musicState, setMusicState] = useLocalStorage<MusicStateProps>(
    "musicState",
    "paused",
  );
  const [musicTime, setMusicTime] = useLocalStorage<MusicTimeProps>(
    "musicTime",
    ctxInitialValues.musicTime,
  );
  const [musicAudio, setMusicAudio] = useState<HTMLAudioElement | null>(null);
  const [musicVolume, setMusicVolume] = useState(1);
  const [repeatMusic, setRepeatMusic] = useState(false);
  const [shufflePlaylist, setShufflePlaylist] = useState(false);
  const [mutatedMusic, setMutatedMusic] = useState(false);

  const [localCurrentMusic, setLocalCurrentMusic] =
    useLocalStorage<MusicProps | null>("currentMusic", null);
  const [localRepeatMusic, setLocalRepeatMusic] = useLocalStorage(
    "repeatMusic",
    false,
  );
  const [localShufflePlaylist, setLocalShufflePlaylist] = useLocalStorage(
    "shuffleMusic",
    false,
  );

  useQuery<MusicProps | null>({
    queryKey: ["verify-music"],
    queryFn: async () => {
      setMusicState("paused");
      try {
        if (!localCurrentMusic) throw Error("");
        const { data } = await api.get(`/music/${localCurrentMusic.id}`);
        if (!data) throw Error("");
        setCurrentMusic(data);
        setLocalCurrentMusic(data);
        const audio = new Audio(data.audio);
        audio.currentTime = musicTime.currentTimeNum;
        audio.onloadedmetadata = () => {
          const duration = audio.duration;
          const { musicDurationTime } = musicTimeFormatter(audio);
          setMusicAudio(audio);
          setMusicTime((prev) => {
            return {
              ...prev,
              duration: musicDurationTime,
              durationNumber: duration,
            };
          });
        };
        return data || null;
      } catch (e) {
        setCurrentMusic(null);
        setLocalCurrentMusic(null);
        return null;
      }
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const { data: DBPlaylist = [] } = useQuery<MusicProps[]>({
    queryKey: ["DBPlaylist"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/musics");
        setPlaylist(data || []);
        return data || [];
      } catch (err) {
        console.error(err);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    setCurrentMusic(localCurrentMusic);
  }, [localCurrentMusic]);

  useEffect(() => {
    if (
      currentMusic &&
      currentMusic.audio !== musicAudio?.src &&
      musicState === "playing"
    ) {
      musicAudio?.pause();
    }
  }, [currentMusic, musicAudio, musicState]);

  const shufflePlaylists = useCallback(() => {
    if (shufflePlaylist) {
      const size = playlist.length;
      let currentIndex = size - 1;
      while (currentIndex > 0) {
        const randomIndex = Math.floor(Math.random() * size);
        const aux = playlist[currentIndex];
        playlist[currentIndex] = playlist[randomIndex];
        playlist[randomIndex] = aux;
        currentIndex -= 1;
      }
    }
  }, [playlist, shufflePlaylist]);

  useEffect(() => {
    setRepeatMusic(localRepeatMusic);
    setShufflePlaylist(localShufflePlaylist);
    shufflePlaylists();
  }, [localRepeatMusic, localShufflePlaylist, shufflePlaylists]);

  const playMusic = useCallback(
    (music: MusicProps, otherPlaylist?: MusicProps[]) => {
      setPlaylist(otherPlaylist || DBPlaylist);

      setCurrentMusic(music);
      setLocalCurrentMusic(music);

      musicAudio?.pause();
      const audio = new Audio(music.audio);
      if (musicAudio?.src === music.audio) {
        audio.currentTime = musicTime.currentTimeNum;
      }
      setMusicAudio(audio);
      audio.play();

      setMusicState("playing");
    },
    [
      DBPlaylist,
      musicAudio,
      musicTime.currentTimeNum,
      setLocalCurrentMusic,
      setMusicState,
    ],
  );

  const pauseMusic = useCallback(() => {
    musicAudio && musicAudio.pause();
    setMusicState("paused");
  }, [musicAudio, setMusicState]);

  const skipMusic = useCallback(() => {
    for (let i = 0; i < playlist.length; i++) {
      const music = playlist[i];
      music.id === currentMusic?.id &&
        playMusic(playlist[playlist.length - 1 === i ? 0 : i + 1], playlist);
    }
  }, [currentMusic?.id, playMusic, playlist]);

  const previousMusic = useCallback(() => {
    for (let i = 0; i < playlist.length; i++) {
      const music = playlist[i];
      music.id === currentMusic?.id &&
        playMusic(playlist[i === 0 ? playlist.length - 1 : i - 1], playlist);
    }
  }, [currentMusic?.id, playMusic, playlist]);

  const toggleRepeatMusic = useCallback(() => {
    if (repeatMusic) {
      setRepeatMusic(false);
      setLocalRepeatMusic(false);
    } else {
      setRepeatMusic(true);
      setLocalRepeatMusic(true);
    }
  }, [repeatMusic, setLocalRepeatMusic]);

  const toggleShufflePlaylist = useCallback(() => {
    if (shufflePlaylist) {
      setShufflePlaylist(false);
      setLocalShufflePlaylist(false);
    } else {
      setShufflePlaylist(true);
      setLocalShufflePlaylist(true);
    }
    shufflePlaylists();
  }, [setLocalShufflePlaylist, shufflePlaylist, shufflePlaylists]);

  const updateMusicTime = useCallback(() => {
    musicStateAux === 0 ? setMusicStateAux(1) : setMusicState("playing");
    if (musicAudio) {
      const musicDuration = musicAudio.duration;
      const musicCurrentTime = musicAudio.currentTime;
      const musicProgress = (musicCurrentTime * 100) / musicDuration;
      const { musicCurrentTime: musicCurrentTimeFormatted, musicDurationTime } =
        musicTimeFormatter(musicAudio);

      setMusicTime({
        currentTime: musicCurrentTimeFormatted,
        currentTimeNum: musicCurrentTime,
        duration: musicDurationTime,
        progress: Math.floor(musicProgress),
        durationNum: musicDuration,
      });
    }
  }, [musicAudio, musicStateAux, setMusicState, setMusicTime]);

  const musicEnded = useCallback(() => {
    if (repeatMusic) {
      playMusic(currentMusic!);
    } else {
      skipMusic();
    }
  }, [currentMusic, playMusic, repeatMusic, skipMusic]);

  useEffect(() => {
    musicAudio?.addEventListener("play", () => setMusicState("playing"));
    musicAudio?.addEventListener("pause", () => setMusicState("paused"));
    musicAudio?.addEventListener("timeupdate", updateMusicTime);
    musicAudio?.addEventListener("ended", musicEnded);
    return () => {
      musicAudio?.removeEventListener("play", () => setMusicState("playing"));
      musicAudio?.removeEventListener("pause", () => setMusicState("paused"));
      musicAudio?.removeEventListener("ended", musicEnded);
      musicAudio?.removeEventListener("timeupdate", updateMusicTime);
    };
  }, [musicAudio, musicEnded, setMusicState, updateMusicTime]);

  const handleMusicVolume = useCallback(
    (value?: number) => {
      if (value && musicAudio) {
        musicAudio.volume = value;
        setMusicVolume(musicAudio.volume);
      }
      if (!value && musicAudio && musicAudio.volume > 0) {
        musicAudio.volume = 0;
        setMusicVolume(0);
        setMutatedMusic(true);
      } else if (!value && musicAudio) {
        musicAudio.volume = 1;
        setMusicVolume(1);
        setMutatedMusic(false);
      } else {
        setMutatedMusic(false);
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
        playlist,
        DBPlaylist,
        currentMusic,
        musicState,
        musicTime,
        musicVolume,
        repeatMusic,
        shufflePlaylist,
        mutatedMusic,
        playMusic,
        pauseMusic,
        skipMusic,
        previousMusic,
        toggleRepeatMusic,
        toggleShufflePlaylist,
        handleMusicTime,
        handleMusicVolume,
      }}
    >
      {props.children}
    </MusicContext.Provider>
  );
}
