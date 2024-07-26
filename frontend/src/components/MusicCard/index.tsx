import {
  type HorizontalMusicCardProps,
  HorizontalMusicCard,
} from "./HorizontalCard";
import { type VerticalMusicCardProps, VerticalMusicCard } from "./VerticalCard";

interface MusicCardProps
  extends HorizontalMusicCardProps,
    VerticalMusicCardProps {
  readonly orientation?: "horizontal" | "vertical";
}

export function MusicCard(props: MusicCardProps) {
  const { orientation = "vertical" } = props;
  if (orientation === "vertical") {
    return <VerticalMusicCard {...props} />;
  }
  return <HorizontalMusicCard {...props} />;
}

export { ControlButton } from "./ControlButton";
