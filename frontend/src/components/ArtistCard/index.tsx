import {
  HorizontalArtistCard,
  type HorizontalArtistCardProps,
} from "./HorizontalCard";
import {
  VerticalArtistCard,
  type VerticalArtistCardProps,
} from "./VerticalCard";

interface ArtistCardProps
  extends HorizontalArtistCardProps,
    VerticalArtistCardProps {
  readonly orientation?: "horizontal" | "vertical";
}

export function ArtistCard(props: ArtistCardProps) {
  const { orientation = "vertical" } = props;
  if (orientation === "vertical") {
    return <VerticalArtistCard {...props} />;
  }
  return <HorizontalArtistCard {...props} />;
}
