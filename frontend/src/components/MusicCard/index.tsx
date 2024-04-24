import {
  HorizontalMusicCard,
  type HorizontalMusicCardProps,
} from "./HorizontalCard";
import { VerticalMusicCard, type VerticalMusicCardProps } from "./VerticalCard";

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
