import * as Slider from "@radix-ui/react-slider";
import { motion } from "framer-motion";
import { animation } from "../animationConstants";

interface MusicVolumeSliderProps {
  musicVolume: number;
  handleMusicVolume: (value: number) => void;
  isMiniPlayer?: boolean;
}

export function MusicVolumeSlider({
  musicVolume,
  handleMusicVolume,
  isMiniPlayer = false,
}: MusicVolumeSliderProps) {
  return (
    <motion.div variants={animation.playerSoundBar}>
      <Slider.Root
        defaultValue={[1]}
        max={1}
        step={0.1}
        aria-label="Volume"
        value={[musicVolume]}
        onValueChange={(value) => handleMusicVolume(value[0])}
        className={`hidden md:flex w-24 ${
          !isMiniPlayer ? "lg:w-28" : ""
        } rounded-3xl h-1.5 items-center relative`}
      >
        <div className="h-4 w-full relative flex items-center cursor-pointer">
          <Slider.Track className="bg-white/20 grow w-full h-1.5 absolute rounded-3xl">
            <Slider.Range className="group-hover/volume:bg-blue-600 bg-white/50 h-full absolute rounded-3xl transition-colors duration-300" />
          </Slider.Track>
          <Slider.Thumb className="block cursor-grab active:cursor-grabbing h-0 w-0 group-hover/volume:h-3 group-hover/volume:w-3 bg-blue-400 rounded-full focus:outline-none focus:w-3 focus:h-3 focus:ring-2 ring-blue-400 ring-offset-4 ring-offset-black duration-300" />
        </div>
      </Slider.Root>
    </motion.div>
  );
}
