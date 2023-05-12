import { HTMLMotionProps } from "framer-motion";

export interface BaseType extends HTMLMotionProps<"button"> {
  isMiniPlayer?: boolean;
}
