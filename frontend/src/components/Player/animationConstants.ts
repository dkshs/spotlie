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

export const animation = {
  playerContainer,
  playerItem,
  playerProgressBar,
  playerSoundBar,
};
