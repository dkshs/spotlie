import { useMusic } from "@/hooks/useMusic";
import { useRouter } from "next/router";

import Image from "next/image";
import Link from "next/link";
import { Meta } from "@/components/Meta";
import { PlayerComponents, animation } from "@/components/Player";
import { AnimatePresence, motion } from "framer-motion";

import { CaretDown } from "@phosphor-icons/react";

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

  const { Control } = PlayerComponents;

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
          className="fixed bottom-0 inset-x-0 bg-black/50 backdrop-blur-2xl z-10 group/time"
          variants={animation.playerContainer}
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
              <PlayerComponents.MusicProgressBar
                progress={musicTime.progress}
                handleMusicTime={handleMusicTime}
              />
            </div>
            <div className="flex items-center justify-center gap-3 flex-wrap w-full">
              <Control.ShufflePlaylist
                shufflePlaylist={shufflePlaylist}
                onClick={() => toggleShufflePlaylist()}
              />
              <Control.PreviousNextMusic
                onClick={() => previousMusic()}
                isPreviousMusicControl
              />
              <Control.PlayPause
                musicState={musicState}
                onClick={() =>
                  musicState === "playing"
                    ? pauseMusic()
                    : playMusic(currentMusic)
                }
              />
              <Control.PreviousNextMusic onClick={() => skipMusic()} />
              <Control.RepeatMusic
                repeatMusic={repeatMusic}
                onClick={() => toggleRepeatMusic()}
              />
            </div>
            <div className="hidden sm:flex absolute gap-2 right-0 mr-5 xs:mr-9 lg:mr-14 items-center group/volume">
              <Control.Volume
                musicVolume={musicVolume}
                mutatedMusic={mutatedMusic}
                onClick={() => handleMusicVolume()}
              />
              <PlayerComponents.MusicVolumeSlider
                handleMusicVolume={handleMusicVolume}
                musicVolume={musicVolume}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  );
}
