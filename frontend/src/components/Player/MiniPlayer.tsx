import { useMusic } from "@/hooks/useMusic";

import { animation, PlayerComponents } from ".";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import { ArrowsOutSimple } from "@phosphor-icons/react";

export function MiniPlayer() {
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

  const { playerContainer, playerItem } = animation;
  const { Control, MusicProgressBar, MusicVolumeSlider } = PlayerComponents;

  return (
    currentMusic && (
      <motion.div
        variants={playerContainer}
        initial="hidden"
        animate="visible"
        className="fixed bottom-0 inset-x-0 bg-black/80 backdrop-blur-2xl z-[9999] group/time"
      >
        <AnimatePresence>
          {musicState === "playing" && (
            <motion.div
              key={currentMusic.id}
              className="absolute inset-0 z-[-1] overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="animate-player absolute inset-0 bg-center bg-cover bg-no-repeat z-[-1] blur-3xl opacity-20"
                style={{ backgroundImage: `url(${currentMusic.cover})` }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="h-0.5 bg-zinc-600">
          <div className="opacity-0 absolute translate-y-4 flex group-hover/time:opacity-100 group-hover/time:translate-y-0 justify-between inset-x-0 -top-6 max-w-[1600px] mx-auto px-4 duration-300">
            <span className="text-xs opacity-75">{musicTime.currentTime}</span>
            <span className="text-xs opacity-75">{musicTime.duration}</span>
          </div>
          <MusicProgressBar
            progress={musicTime.progress}
            handleMusicTime={handleMusicTime}
            isMiniPlayer
          />
        </div>
        <div className="p-4 flex items-center justify-between max-w-[1600px] min-w-[320px] m-auto">
          <motion.div
            variants={playerItem}
            className="flex sm:w-[30%] truncate"
          >
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
              <div className="flex opacity-0 rounded-lg absolute justify-center items-center inset-0 group-hover:opacity-100 group-focus:opacity-100 group-hover:bg-black/50 group-focus:bg-black/50 duration-200">
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
          </motion.div>
          <div className="flex items-center justify-center gap-3 sm:w-[40%]">
            <Control.ShufflePlaylist
              isMiniPlayer
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
              isMiniPlayer
              repeatMusic={repeatMusic}
              onClick={() => toggleRepeatMusic()}
            />
          </div>
          <div className="hidden sm:flex justify-end group w-[30%] items-center gap-2 group/volume">
            <Control.Volume
              musicVolume={musicVolume}
              mutatedMusic={mutatedMusic}
              onClick={() => handleMusicVolume()}
            />
            <MusicVolumeSlider
              handleMusicVolume={handleMusicVolume}
              musicVolume={musicVolume}
              isMiniPlayer
            />
          </div>
        </div>
      </motion.div>
    )
  );
}
