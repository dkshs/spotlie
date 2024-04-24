import type {
  MusicContextProps,
  MusicStateProps,
  MusicTimeProps,
  PlayMusicProps,
} from "./types";
import type {
  MusicProps,
  PlaylistMusicProps,
  PlaylistPropsWithMusics,
} from "@/utils/types";

import {
  type PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "usehooks-ts";
import { ctxInitialValues } from "./ctxInitialValues";
import { useApi } from "@/hooks/useApi";

import { musicTimeFormatter } from "@/utils/formatters";
import { turnMusicsInPlaylist } from "@/utils/turnMusicsInPlaylist";

export const MusicContext = createContext<MusicContextProps>(ctxInitialValues);

export function MusicContextProvider(props: PropsWithChildren) {
  const { fetcher } = useApi();
  const [playlist, setPlaylist] = useState<PlaylistPropsWithMusics | null>(
    null,
  );
  const [currentMusic, setCurrentMusic] = useState<MusicProps | null>(null);
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
  const [localPlaylist, setLocalPlaylist] =
    useLocalStorage<PlaylistPropsWithMusics | null>("playlist", null);
  const [localRepeatMusic, setLocalRepeatMusic] = useLocalStorage(
    "repeatMusic",
    false,
  );
  const [localShufflePlaylist, setLocalShufflePlaylist] = useLocalStorage(
    "shuffleMusic",
    false,
  );

  useQuery({
    queryKey: ["verify-music"],
    queryFn: async () => {
      setMusicState("paused");
      try {
        if (!localCurrentMusic || !localCurrentMusic.id)
          throw new Error("No music");
        const { data } = await fetcher<MusicProps>(
          `/musics/${localCurrentMusic.id}`,
        );
        if (!data || !data.id) throw new Error("No data");
        setCurrentMusic(data);
        setLocalCurrentMusic(data);
        const audio = new Audio(data.audio);
        audio.currentTime = musicTime.currentTimeNum;
        audio.addEventListener("loadedmetadata", () => {
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
        });
      } catch {
        setCurrentMusic(null);
        setLocalCurrentMusic(null);
        setPlaylist(null);
        setLocalPlaylist(null);
      }
      return null;
    },
    refetchOnWindowFocus: false,
  });

  useQuery({
    queryKey: ["initialPlaylist"],
    queryFn: async () => {
      try {
        if (localPlaylist && localPlaylist.musics.length > 0) {
          setPlaylist(localPlaylist);
          setLocalPlaylist(localPlaylist);
          return null;
        }
        const { data } = await fetcher<MusicProps[]>("/musics/?limit=10");
        const pl =
          playlist && playlist.musics.length > 0
            ? playlist
            : turnMusicsInPlaylist(data || []);
        setPlaylist(pl);
        setLocalPlaylist(pl);
      } catch (error) {
        console.error(error);
      }
      return null;
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setCurrentMusic(localCurrentMusic);
    setPlaylist(localPlaylist);
  }, [localCurrentMusic, localPlaylist]);

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
    const musics = playlist?.musics;
    if (shufflePlaylist && musics && musics.length > 0) {
      const size = musics.length;
      let currentIndex = size - 1;
      while (currentIndex > 0) {
        const randomIndex = Math.floor(Math.random() * size);
        const aux = musics[currentIndex];
        musics[currentIndex] = musics[randomIndex] as PlaylistMusicProps;
        musics[randomIndex] = aux as PlaylistMusicProps;
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
    ({ music, otherPlaylist, musics = [] }: PlayMusicProps) => {
      if (!music) return;
      setMusicAudio((audio) => {
        audio && audio.pause();
        return audio;
      });
      const pl = otherPlaylist || turnMusicsInPlaylist(musics);
      setPlaylist(pl);
      setLocalPlaylist(pl);

      setCurrentMusic(music);
      setLocalCurrentMusic(music);

      setMusicAudio((musicAudio) => {
        const audio = new Audio(music.audio);
        if (audio.src === musicAudio?.src) {
          return musicAudio;
        }
        return audio;
      });
      setMusicAudio((musicAudio) => {
        musicAudio && musicAudio.play();
        return musicAudio;
      });

      setMusicState("playing");
    },
    [setLocalCurrentMusic, setLocalPlaylist, setMusicState],
  );

  const pauseMusic = useCallback(() => {
    setMusicAudio((musicAudio) => {
      musicAudio && musicAudio.pause();
      setMusicState("paused");
      return musicAudio;
    });
  }, [setMusicState]);

  const skipMusic = useCallback(() => {
    const musics = playlist?.musics || [];
    if (musics.length === 0) return;
    if (musics.length === 1) {
      musics[0] && playMusic({ music: musics[0], otherPlaylist: playlist });
      return;
    }
    if (musics.length > 1) {
      for (let i = 0; i < musics.length; i++) {
        const music = musics[i];
        music?.id === currentMusic?.id &&
          playMusic({ music: musics[i + 1]!, otherPlaylist: playlist });
      }
    }
  }, [currentMusic?.id, playMusic, playlist]);

  const previousMusic = useCallback(() => {
    const musics = playlist?.musics || [];
    if (musics.length === 0) return;
    if (musics.length === 1) {
      musics[0] && playMusic({ music: musics[0], otherPlaylist: playlist });
      return;
    }
    if (musics.length > 1) {
      for (let i = 0; i < musics.length; i++) {
        const music = musics[i];
        music?.id === currentMusic?.id &&
          playMusic({ music: musics[i - 1]!, otherPlaylist: playlist });
      }
    }
  }, [currentMusic?.id, playMusic, playlist]);

  const toggleRepeatMusic = useCallback(() => {
    setRepeatMusic((prev) => !prev);
    setLocalRepeatMusic((prev) => !prev);
  }, [setLocalRepeatMusic]);

  const toggleShufflePlaylist = useCallback(() => {
    setShufflePlaylist((prev) => !prev);
    setLocalShufflePlaylist((prev) => !prev);
    shufflePlaylists();
  }, [setLocalShufflePlaylist, shufflePlaylists]);

  const updateMusicTime = useCallback(() => {
    setMusicTime((prev) => {
      if (!musicAudio) return prev;
      const musicDuration = musicAudio.duration;
      const musicCurrentTime = musicAudio.currentTime;
      const musicProgress = (musicCurrentTime * 100) / musicDuration;
      const { musicCurrentTime: musicCurrentTimeFormatted, musicDurationTime } =
        musicTimeFormatter(musicAudio);

      return {
        currentTime: musicCurrentTimeFormatted,
        currentTimeNum: musicCurrentTime,
        duration: musicDurationTime,
        progress: Math.floor(musicProgress),
        durationNum: musicDuration,
      };
    });
  }, [musicAudio, setMusicTime]);

  const musicEnded = useCallback(() => {
    if (repeatMusic) {
      playMusic({ music: currentMusic! });
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
      musicAudio?.removeEventListener("timeupdate", updateMusicTime);
      musicAudio?.removeEventListener("ended", musicEnded);
    };
  }, [musicAudio, musicEnded, setMusicState, updateMusicTime]);

  const handleMusicVolume = useCallback(
    (value?: number) => {
      if (value && musicAudio) {
        musicAudio.volume = value;
        setMusicVolume(musicAudio.volume);
        value > 0 ? setMutatedMusic(false) : setMutatedMusic(true);
      }
      if (!value && musicAudio && musicAudio.volume > 0) {
        musicAudio.volume = 0;
        setMusicVolume(0);
        setMutatedMusic(true);
      } else if (!value && musicAudio) {
        musicAudio.volume = 1;
        setMusicVolume(1);
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

  const contextValues = useMemo(
    () => ({
      playlist,
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
    }),
    [
      currentMusic,
      handleMusicTime,
      handleMusicVolume,
      musicState,
      musicTime,
      musicVolume,
      mutatedMusic,
      pauseMusic,
      playMusic,
      playlist,
      previousMusic,
      repeatMusic,
      shufflePlaylist,
      skipMusic,
      toggleRepeatMusic,
      toggleShufflePlaylist,
    ],
  );

  return (
    <MusicContext.Provider value={contextValues}>
      {props.children}
    </MusicContext.Provider>
  );
}
