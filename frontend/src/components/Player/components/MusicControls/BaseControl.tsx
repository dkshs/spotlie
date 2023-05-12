import { animation } from "../../animationConstants";
import { HTMLMotionProps, motion } from "framer-motion";

interface BaseControlProps extends HTMLMotionProps<"button"> {
  isPlayPauseControl?: boolean;
}

export function BaseControl({
  isPlayPauseControl = false,
  className,
  ...props
}: BaseControlProps) {
  return (
    <motion.button
      variants={animation.playerItem}
      type="button"
      whileHover={isPlayPauseControl ? { scale: 1.1 } : {}}
      whileTap={{ opacity: 0.7, scale: 0.95 }}
      animate={{ opacity: 1 }}
      className={`p-2.5 rounded-full hover:text-blue-400 focus:outline-none focus:text-blue-400 focus:ring-2 ring-blue-300 duration-300 ${className}`}
      {...props}
    />
  );
}
