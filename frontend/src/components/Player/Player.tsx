import { useMusic } from "@/hooks/useMusic";
import * as Progress from "@radix-ui/react-progress";
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
  SpeakerSlash,
} from "phosphor-react";

export function Player() {
  const {
    currentMusic,
    playMusic,
    musicState,
    pauseMusic,
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
  } = useMusic();

  return (
    currentMusic && (
      <div className="fixed bottom-0 inset-x-0 bg-black/80 backdrop-blur-2xl z-[9999] group/time">
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
          <div className="hidden absolute group-hover/time:flex justify-between inset-x-0 -top-6 max-w-[1600px] mx-auto px-4">
            <span className="text-xs opacity-75">{time.currentTime}</span>
            <span className="text-xs opacity-75">{time.duration}</span>
          </div>
          <Progress.Root
            value={time.percentage}
            className="max-w-[1600px] mx-auto bg-white/20"
          >
            <button
              className="w-full h-4 absolute -top-2 max-w-[1600px] mx-auto outline-none"
              onClick={handleMusicTime}
            />
            <Progress.Indicator
              className="relative h-0.5 bg-white duration-300 flex items-center"
              style={{ width: `${time.percentage}%` }}
            >
              <div className="hidden group-hover/time:inline-block cursor-grab absolute p-1.5 bg-white rounded-full outline-none right-0" />
            </Progress.Indicator>
          </Progress.Root>
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
              <div className="hidden absolute justify-center items-center inset-0 group-hover:flex group-hover:bg-black/50 group-focus:flex group-focus:bg-black/50">
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
              onClick={() => shuffleMusics()}
              title={`${isShuffle ? "Desativar" : "Ativar"} a ordem aleatória`}
              className={`hidden xs:inline-flex p-2.5 ${
                isShuffle && "text-blue-600"
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
                  : playMusic(currentMusic, musics)
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
              title={`${isRepeat ? "Não repetir" : "Repetir"}`}
              onClick={() => repeatMusic()}
              className={`hidden xs:inline-flex p-2.5 ${
                isRepeat && "text-blue-600"
              } hover:text-blue-400 duration-300 active:opacity-70 focus:outline-none focus:text-blue-400 focus:ring-2 ring-blue-300 rounded-full`}
            >
              {isRepeat ? (
                <RepeatOnce size={24} weight="fill" />
              ) : (
                <Repeat size={24} weight="fill" />
              )}
            </button>
          </div>
          <div className="hidden sm:flex justify-end group w-[30%]">
            <button
              type="button"
              title={isMuted ? "Com som" : "Mudo"}
              onClick={() => handleMusicVolume()}
              className="p-2.5 hover:text-blue-400 duration-300 active:opacity-70 focus:outline-none focus:text-blue-400 focus:ring-2 ring-blue-300 rounded-full"
            >
              {isMuted ? <SpeakerSlash size={24} /> : <SpeakerHigh size={24} />}
            </button>
          </div>
        </div>
      </div>
    )
  );
}
