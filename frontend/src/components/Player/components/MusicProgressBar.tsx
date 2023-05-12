import * as Slider from "@radix-ui/react-slider";
import { motion } from "framer-motion";
import { animation } from "../animationConstants";

interface MusicProgressBarProps {
  progress: number;
  handleMusicTime: (value: number) => void;
  isMiniPlayer?: boolean;
}

export function MusicProgressBar({
  progress,
  handleMusicTime,
  isMiniPlayer = false,
}: MusicProgressBarProps) {
  return (
    <motion.div variants={animation.playerProgressBar}>
      <Slider.Root
        defaultValue={[0]}
        max={100}
        step={1}
        aria-label="Progresso da música"
        value={[progress]}
        onValueChange={(value) => handleMusicTime(value[0])}
        className={`${
          isMiniPlayer ? "max-w-[1600px] mx-auto" : ""
        } w-full flex items-center select-none touch-auto h-0.5 relative`}
      >
        <div className="h-4 w-full relative flex items-center cursor-pointer">
          <Slider.Track className="bg-white/20 grow w-full h-0.5 absolute">
            <Slider.Range className="bg-white h-full absolute" />
          </Slider.Track>
          <Slider.Thumb className="block w-1 h-1 cursor-grab active:cursor-grabbing group-hover/time:h-4 group-hover/time:w-4 bg-white rounded-full focus:w-4 focus:h-4 focus:outline-none focus:ring-2 ring-purple-400 ring-offset-4 ring-offset-black duration-300" />
        </div>
      </Slider.Root>
    </motion.div>
  );
}
