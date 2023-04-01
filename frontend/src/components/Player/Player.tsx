import { useMusic } from "@/hooks/useMusic";

import * as Slider from "@radix-ui/react-slider";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowsOutSimple,
  Pause,
  Play,
  Repeat,
  RepeatOnce,
  Shuffle,
  SkipBack,
  SkipForward,
  SpeakerHigh,
  SpeakerLow,
  SpeakerSlash,
} from "@phosphor-icons/react";

export function Player() {
  const {
    currentMusic,
    playMusic,
    musicState,
    pauseMusic,
    musicTime,
    repeatMusic,
    toggleRepeatMusic,
    skipMusic,
    previousMusic,
    shufflePlaylist,
    toggleShufflePlaylist,
    handleMusicVolume,
    mutatedMusic,
    handleMusicTime,
    musicVolume,
  } = useMusic();

  return (
    currentMusic && (
      <div className="animate-playerFadeIn fixed bottom-0 inset-x-0 bg-black/80 backdrop-blur-2xl z-[9999] group/time">
        <div className="absolute inset-0 z-[-1] overflow-hidden">
          <div
            className={`absolute inset-0 bg-center ${
              musicState === "playing" && "animate-player"
            } bg-cover bg-no-repeat z-[-1] blur-3xl opacity-20 transition-all duration-1000`}
            style={
              musicState === "playing"
                ? { backgroundImage: `url(${currentMusic.cover})` }
                : { background: "transparent" }
            }
          />
        </div>
        <div className="h-0.5 bg-zinc-600">
          <div className="opacity-0 absolute translate-y-4 flex group-hover/time:opacity-100 group-hover/time:translate-y-0 justify-between inset-x-0 -top-6 max-w-[1600px] mx-auto px-4 duration-300">
            <span className="text-xs opacity-75">{musicTime.currentTime}</span>
            <span className="text-xs opacity-75">{musicTime.duration}</span>
          </div>
          <Slider.Root
            defaultValue={[0]}
            max={100}
            step={1}
            aria-label="Progresso da música"
            value={[musicTime.progress]}
            onValueChange={(value) => handleMusicTime(value[0])}
            className="max-w-[1600px] mx-auto w-full flex items-center select-none touch-auto h-0.5 relative"
          >
            <div className="h-4 w-full relative flex items-center cursor-pointer">
              <Slider.Track className="bg-white/20 grow w-full h-0.5 absolute">
                <Slider.Range className="bg-white h-full absolute" />
              </Slider.Track>
              <Slider.Thumb className="block w-1 h-1 cursor-grab group-hover/time:h-4 group-hover/time:w-4 bg-white rounded-full focus:w-4 focus:h-4 focus:outline-none focus:ring-2 ring-purple-400 ring-offset-4 ring-offset-black duration-300" />
            </div>
          </Slider.Root>
        </div>
        <div className="p-4 flex items-center justify-between max-w-[1600px] min-w-[320px] m-auto">
          <div className="flex group sm:w-[30%] truncate">
            <Link
              href="/player"
              title="Abrir player"
              className="relative rounded-lg group focus:outline outline-2 outline-purple-400"
            >
              <Image
                src={currentMusic.cover}
                alt={currentMusic.title}
                className="rounded-lg min-w-[56px] min-h-[56px]"
                height={56}
                width={56}
              />
              <div className="hidden rounded-lg absolute justify-center items-center inset-0 group-hover:flex group-hover:bg-black/50 group-focus:flex group-focus:bg-black/50">
                <div className="w-full h-full flex justify-center items-center rounded-lg duration-300">
                  <ArrowsOutSimple
                    size={32}
                    className="hover:text-blue-400 duration-200"
                  />
                </div>
              </div>
            </Link>
            <div className="flex flex-col gap-0.5 px-3 truncate">
              <Link
                href={`/music/${currentMusic.id}`}
                title={currentMusic.title}
                className="truncate hover:text-blue-400 focus:outline focus:text-blue-400 outline-1 outline-blue-300 duration-300"
              >
                {currentMusic.title}
              </Link>
              <Link
                href={`/artist/${currentMusic.artist.id}`}
                title={currentMusic.artist.name}
                className="truncate hover:text-blue-400 focus:outline focus:text-blue-400 outline-1 outline-blue-300 duration-300"
              >
                {currentMusic.artist.name}
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 sm:w-[40%]">
            <button
              type="button"
              onClick={() => toggleShufflePlaylist()}
              title={`${
                shufflePlaylist ? "Desativar" : "Ativar"
              } a ordem aleatória`}
              className={`hidden xs:inline-flex p-2.5 ${
                shufflePlaylist && "text-blue-600"
              } hover:text-blue-400 duration-300 active:opacity-70 focus:outline-none focus:text-blue-400 focus:ring-2 ring-blue-300 rounded-full`}
            >
              <Shuffle size={24} weight="fill" />
            </button>
            <button
              type="button"
              title="Voltar"
              onClick={() => previousMusic()}
              className="p-2.5 hover:text-blue-400 duration-300 active:opacity-70 focus:outline-none focus:text-blue-400 focus:ring-2 ring-blue-300 rounded-full"
            >
              <SkipBack size={24} weight="fill" />
            </button>
            <button
              type="button"
              title={`${musicState === "playing" ? "Pausar" : "Play"}`}
              onClick={() =>
                musicState === "playing"
                  ? pauseMusic()
                  : playMusic(currentMusic)
              }
              className="p-2.5 bg-zinc-800 rounded-full hover:scale-110 hover:bg-zinc-900 hover:text-blue-400 duration-300 active:opacity-70 active:scale-100 focus:outline-none focus:text-blue-400 focus:ring-2 ring-blue-300"
            >
              {musicState === "playing" ? (
                <Pause size={24} weight="fill" />
              ) : (
                <Play size={24} weight="fill" />
              )}
            </button>
            <button
              type="button"
              title="Avançar"
              onClick={() => skipMusic()}
              className="p-2.5 hover:text-blue-400 duration-300 active:opacity-70 focus:outline-none focus:text-blue-400 focus:ring-2 ring-blue-300 rounded-full"
            >
              <SkipForward size={24} weight="fill" />
            </button>
            <button
              type="button"
              title={`${repeatMusic ? "Não repetir" : "Repetir"}`}
              onClick={() => toggleRepeatMusic()}
              className={`hidden xs:inline-flex p-2.5 ${
                repeatMusic && "text-blue-600"
              } hover:text-blue-400 duration-300 active:opacity-70 focus:outline-none focus:text-blue-400 focus:ring-2 ring-blue-300 rounded-full`}
            >
              {repeatMusic ? (
                <RepeatOnce size={24} weight="fill" />
              ) : (
                <Repeat size={24} weight="fill" />
              )}
            </button>
          </div>
          <div className="hidden sm:flex justify-end group w-[30%] items-center gap-2 group/volume">
            <button
              type="button"
              title={mutatedMusic ? "Com som" : "Mudo"}
              onClick={() => handleMusicVolume()}
              className="p-2.5 hover:text-blue-400 duration-300 active:opacity-70 focus:outline-none focus:text-blue-400 focus:ring-2 ring-blue-300 rounded-full"
            >
              {mutatedMusic ? (
                <SpeakerSlash size={24} />
              ) : musicVolume <= 0.5 ? (
                <SpeakerLow size={24} />
              ) : (
                <SpeakerHigh size={24} />
              )}
            </button>
            <Slider.Root
              defaultValue={[1]}
              max={1}
              step={0.1}
              value={[musicVolume]}
              onValueChange={(value) => handleMusicVolume(value[0])}
              aria-label="Volume"
              className="hidden md:flex w-24 rounded-3xl h-1.5 items-center relative"
            >
              <div className="h-4 w-full relative flex items-center">
                <Slider.Track className="bg-white/20 grow w-full h-1.5 absolute rounded-3xl">
                  <Slider.Range className="group-hover/volume:bg-blue-600 bg-white/50 h-full absolute rounded-3xl duration-300" />
                </Slider.Track>
                <Slider.Thumb className="block cursor-grab h-0 w-0 group-hover/volume:h-3 group-hover/volume:w-3 bg-blue-400 rounded-full focus:outline-none focus:w-3 focus:h-3 focus:ring-2 ring-blue-400 ring-offset-4 ring-offset-black duration-300" />
              </div>
            </Slider.Root>
          </div>
        </div>
      </div>
    )
  );
}
