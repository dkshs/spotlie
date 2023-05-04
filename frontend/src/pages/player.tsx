import { useMusic } from "@/hooks/useMusic";
import { useRouter } from "next/router";

import * as Slider from "@radix-ui/react-slider";
import Image from "next/image";
import Link from "next/link";
import { Meta } from "@/components/Meta";
import { AnimatePresence, motion } from "framer-motion";

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
  SpeakerLow,
  SpeakerSlash,
} from "@phosphor-icons/react";

export default function PlayerPage() {
  const {
    playMusic,
    pauseMusic,
    toggleShufflePlaylist,
    previousMusic,
    skipMusic,
    musicState,
    shufflePlaylist,
    repeatMusic,
    toggleRepeatMusic,
    currentMusic,
    musicTime,
    handleMusicVolume,
    mutatedMusic,
    handleMusicTime,
    musicVolume,
  } = useMusic();
  const router = useRouter();

  const playerContainer = {
    hidden: { opacity: 1, translateY: 88 },
    visible: {
      opacity: 1,
      translateY: 0,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
        duration: 0.3,
      },
    },
  };
  const playerItem = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };
  const playerVisibleBar = {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  };
  const playerSoundBar = {
    hidden: { x: 40, opacity: 0 },
    visible: playerVisibleBar,
  };
  const playerProgressBar = {
    hidden: { x: -100, opacity: 0 },
    visible: playerVisibleBar,
  };

  return (
    currentMusic && (
      <motion.div
        className="px-5 xs:px-9 lg:px-14 h-screen"
        initial={{ opacity: 0, translateY: 88 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Meta path="/player" title="Player" index={false} follow={false} />
        <AnimatePresence>
          {currentMusic.cover && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 z-[-1] bg-center"
            >
              <Image
                className="bg-cover object-cover aspect-square bg-center bg-no-repeat blur-xl opacity-40"
                src={currentMusic.cover}
                alt={currentMusic.title}
                fill
                priority
              />
            </motion.div>
          )}
        </AnimatePresence>
        <nav className="h-[72px] fixed inset-x-0 z-10">
          <div className="px-4 lg:px-10 flex items-center h-full">
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
        <div className="flex flex-col gap-2 items-center md:items-start justify-center h-full pt-16 pb-24">
          <div className="relative max-h-[500px] max-w-[500px] w-full min-w-[200px] min-h-[200px] xs:min-w-[256px] xs:min-h-[256px] md:mb-8 duration-300">
            <Image
              src={currentMusic.cover}
              alt={currentMusic.title}
              className="rounded-lg object-cover aspect-square bg-black/50"
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
                href={`/artist/${currentMusic.artist.id}`}
                title={currentMusic.artist.name}
                className="focus:outline-none focus:underline focus:text-purple-400 hover:text-purple-400 decoration-purple-400 truncate text-lg font-light duration-300"
              >
                {currentMusic.artist.name}
              </Link>
            </div>
          </div>
        </div>
        <motion.div
          className="fixed bottom-0 inset-x-0 bg-black/50 backdrop-blur-2xl z-10 group"
          variants={playerContainer}
          initial="hidden"
          animate="visible"
        >
          <div className="min-h-[90px] relative h-full py-6 gap-6 sm:p-6 flex-col sm:flex-row flex items-center justify-between flex-wrap">
            <div className="absolute top-0 h-0.5 bg-transparent inset-x-0 px-5 xs:px-9 lg:px-12">
              <div className="absolute flex justify-between inset-x-0 -top-6 px-7 xs:px-12 lg:px-14">
                <span className="text-xs opacity-75">
                  {musicTime.currentTime}
                </span>
                <span className="text-xs opacity-75">{musicTime.duration}</span>
              </div>
              <motion.div variants={playerProgressBar}>
                <Slider.Root
                  defaultValue={[0]}
                  max={100}
                  step={1}
                  aria-label="Progresso da música"
                  value={[musicTime.progress]}
                  onValueChange={(value) => handleMusicTime(value[0])}
                  className="w-full flex items-center select-none touch-auto h-0.5 relative"
                >
                  <div className="h-4 w-full relative flex items-center cursor-pointer">
                    <Slider.Track className="bg-white/20 grow w-full h-0.5 absolute">
                      <Slider.Range className="bg-white h-full absolute" />
                    </Slider.Track>
                    <Slider.Thumb className="block cursor-grab h-1 w-1 group-hover:h-4 group-hover:w-4 bg-white rounded-full focus:outline-none focus:w-4 focus:h-4 focus:ring-2 ring-purple-400 ring-offset-4 ring-offset-black duration-300" />
                  </div>
                </Slider.Root>
              </motion.div>
            </div>
            <div className="flex items-center justify-center gap-3 flex-wrap w-full">
              <motion.button
                variants={playerItem}
                type="button"
                onClick={() => toggleShufflePlaylist()}
                title={`${
                  shufflePlaylist ? "Desativar" : "Ativar"
                } a ordem aleatória`}
                className={`p-2.5 ${
                  shufflePlaylist && "text-blue-600"
                } hover:text-blue-400 duration-300 active:opacity-70 focus:outline-none focus:text-blue-400 focus:ring-2 ring-blue-300 rounded-full`}
              >
                <Shuffle size={26} weight="fill" />
              </motion.button>
              <motion.button
                variants={playerItem}
                type="button"
                title="Voltar"
                onClick={() => previousMusic()}
                className="p-2.5 hover:text-blue-400 duration-300 active:opacity-70 focus:outline-none focus:text-blue-400 focus:ring-2 ring-blue-300 rounded-full"
              >
                <SkipBack size={26} weight="fill" />
              </motion.button>
              <motion.button
                variants={playerItem}
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
                  <Pause size={26} weight="fill" />
                ) : (
                  <Play size={26} weight="fill" />
                )}
              </motion.button>
              <motion.button
                variants={playerItem}
                type="button"
                title="Avançar"
                onClick={() => skipMusic()}
                className="p-2.5 hover:text-blue-400 duration-300 active:opacity-70 focus:outline-none focus:text-blue-400 focus:ring-2 ring-blue-300 rounded-full"
              >
                <SkipForward size={26} weight="fill" />
              </motion.button>
              <motion.button
                variants={playerItem}
                type="button"
                title={`${repeatMusic ? "Não repetir" : "Repetir"}`}
                onClick={() => toggleRepeatMusic()}
                className={`p-2.5 ${
                  repeatMusic && "text-blue-600"
                } hover:text-blue-400 duration-300 active:opacity-70 focus:outline-none focus:text-blue-400 focus:ring-2 ring-blue-300 rounded-full`}
              >
                {repeatMusic ? (
                  <RepeatOnce size={26} weight="fill" />
                ) : (
                  <Repeat size={26} weight="fill" />
                )}
              </motion.button>
            </div>
            <div className="hidden sm:flex absolute gap-2 right-0 mr-5 xs:mr-9 lg:mr-14 items-center group/volume">
              <motion.button
                variants={playerItem}
                type="button"
                title={mutatedMusic ? "Com som" : "Mudo"}
                onClick={() => handleMusicVolume()}
                className="p-2.5 hover:text-blue-400 duration-300 active:opacity-70 focus:outline-none focus:text-blue-400 focus:ring-2 ring-blue-300 rounded-full"
              >
                {mutatedMusic ? (
                  <SpeakerSlash size={26} />
                ) : musicVolume <= 0.5 ? (
                  <SpeakerLow size={26} />
                ) : (
                  <SpeakerHigh size={26} />
                )}
              </motion.button>
              <motion.div variants={playerSoundBar}>
                <Slider.Root
                  defaultValue={[1]}
                  max={1}
                  step={0.1}
                  value={[musicVolume]}
                  aria-label="Volume"
                  onValueChange={(value) => handleMusicVolume(value[0])}
                  className="hidden md:flex w-24 lg:w-28 rounded-3xl h-1.5 items-center relative"
                >
                  <div className="h-4 w-full relative flex items-center">
                    <Slider.Track className="bg-white/20 grow w-full h-1.5 absolute rounded-3xl">
                      <Slider.Range className="group-hover/volume:bg-blue-600 bg-white/50 h-full absolute rounded-3xl duration-300" />
                    </Slider.Track>
                    <Slider.Thumb className="block cursor-grab h-0 w-0 group-hover/volume:h-3 group-hover/volume:w-3 bg-blue-400 rounded-full focus:outline-none focus:w-3 focus:h-3 focus:ring-2 ring-blue-400 ring-offset-4 ring-offset-black duration-300" />
                  </div>
                </Slider.Root>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  );
}
