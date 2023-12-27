import type {
  MusicProps,
  PlaylistPropsWithMusics,
  UserProps,
} from "@/utils/types";

export type ActionType = "artist" | "user" | "music" | "playlist";

export interface ActionMenuProps {
  actionId: string;
  actionType?: ActionType;
  triggerClassName?: string;
  label?: string;
  playlist?: PlaylistPropsWithMusics;
  music?: MusicProps;
  user?: UserProps;
  showGoToArtist?: boolean;
  showGoToMusic?: boolean;
}
