import type { MusicProps, PlaylistPropsWithMusics } from "@/utils/types";

export type ActionType = "artist" | "user" | "music" | "playlist";

export interface ActionMenuProps {
  actionId: string;
  actionType?: ActionType;
  triggerClassName?: string;
  label?: string;
  playlist?: PlaylistPropsWithMusics;
  music?: MusicProps;
  showGoToArtist?: boolean;
  showGoToMusic?: boolean;
}
