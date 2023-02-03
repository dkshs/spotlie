import { useMusic } from "@/hooks/useMusic";
import { useRouter } from "next/router";

import Image from "next/image";
import Link from "next/link";
import * as Progress from "@radix-ui/react-progress";

import {
  CaretDown,
  Pause,
  Play,
  Repeat,
  RepeatOnce,
  Shuffle,
  SkipBack,
  SkipForward,
  SpeakerHigh,
} from "phosphor-react";

export default function PlayerPage() {
  const {
    playMusic,
    pauseMusic,
    shuffleMusics,
    previousMusic,
    skipMusic,
    musicState,
    isShuffle,
    isRepeat,
    currentMusic,
    repeatMusic,
    time,
  } = useMusic();
  const router = useRouter();

  return (
    currentMusic && (
      <div className="px-5 xs:px-9 lg:px-14 h-screen">
        <div
          className="absolute inset-0 bg-center bg-cover bg-no-repeat z-[-1] blur-xl opacity-20 transition-all duration-1000"
          style={{ backgroundImage: `url(${currentMusic.cover})` }}
        />
        <nav className="h-[72px] fixed inset-x-0 z-10">
          <div className="px-10 flex items-center h-full">
            <button
              type="button"
              onClick={() => router.back()}
              title="Fechar player"
              className="inline-block p-2.5 hover:text-blue-400 active:opacity-70 focus:outline-none focus:text-blue-400 focus:ring-2 ring-blue-300 rounded-full duration-300"
            >
              <CaretDown size={24} weight="bold" />
            </button>
          </div>
        </nav>
        <div className="flex flex-col gap-2 items-center md:items-start justify-center h-full pt-[72px] pb-[76px]">
          <div className="relative max-h-[500px] max-w-[500px] w-full min-w-[200px] min-h-[200px] xs:min-w-[256px] xs:min-h-[256px] md:mb-8 duration-300">
            <Image
              src={currentMusic.cover}
              alt={currentMusic.title}
              className="rounded-lg object-cover aspect-square"
              width={500}
              height={500}
              priority
            />
          </div>
          <div className="flex flex-col gap-2 my-5 md:m-0 truncate w-full">
            <div>
              <Link
                href={`/music/${currentMusic.id}`}
                title={currentMusic.title}
                className="focus:outline-none focus:underline focus:text-purple-400 hover:text-purple-400 decoration-purple-400 truncate text-2xl font-bold duration-300"
              >
                {currentMusic.title}
              </Link>
            </div>
            <div>
              <Link
                href={`/singer/${currentMusic.artist.id}`}
                title={currentMusic.artist.name}
                className="focus:outline-none focus:underline focus:text-purple-400 hover:text-purple-400 decoration-purple-400 truncate text-lg font-light duration-300"
              >
                {currentMusic.artist.name}
              </Link>
            </div>
          </div>
        </div>
        <div className="fixed bottom-0 inset-x-0 bg-black/50 backdrop-blur-2xl z-10 min-h-[76px]">
          <div className="relative pt-4 pb-2 gap-6 sm:p-4 flex-col sm:flex-row flex items-center justify-between flex-wrap">
            <div className="absolute top-0 h-0.5 bg-transparent inset-x-0 px-5 xs:px-9 lg:px-12">
              <div className="absolute flex justify-between inset-x-0 -top-6 px-7 xs:px-12 lg:px-14">
                <span className="text-xs opacity-75">{time.currentTime}</span>
                <span className="text-xs opacity-75">{time.duration}</span>
              </div>
              <Progress.Root value={time.percentage} className="bg-white/20">
                <Progress.Indicator
                  className="h-0.5 bg-white duration-300"
                  style={{ width: `${time.percentage}%` }}
                ></Progress.Indicator>
              </Progress.Root>
            </div>
            <div className="flex items-center justify-center gap-3 flex-wrap w-full">
              <button
                type="button"
                onClick={() => shuffleMusics()}
                className={`p-2.5 ${
                  isShuffle && "text-blue-600"
                } hover:text-blue-400 duration-300 active:opacity-70 focus:outline-none focus:text-blue-400 focus:ring-2 ring-blue-300 rounded-full`}
              >
                <Shuffle size={24} weight="fill" />
              </button>
              <button
                type="button"
                onClick={() => previousMusic()}
                className="p-2.5 hover:text-blue-400 duration-300 active:opacity-70 focus:outline-none focus:text-blue-400 focus:ring-2 ring-blue-300 rounded-full"
              >
                <SkipBack size={24} weight="fill" />
              </button>
              <button
                type="button"
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
                onClick={() => skipMusic()}
                className="p-2.5 hover:text-blue-400 duration-300 active:opacity-70 focus:outline-none focus:text-blue-400 focus:ring-2 ring-blue-300 rounded-full"
              >
                <SkipForward size={24} weight="fill" />
              </button>
              <button
                type="button"
                onClick={() => repeatMusic()}
                className={`p-2.5 ${
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
            <div className="hidden sm:flex absolute right-0 pr-5 xs:pr-9 lg:pr-14">
              <button
                type="button"
                className="p-2.5 hover:text-blue-400 duration-300 active:opacity-70 focus:outline-none focus:text-blue-400 focus:ring-2 ring-blue-300 rounded-full"
              >
                <SpeakerHigh size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
