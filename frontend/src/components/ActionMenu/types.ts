import type {
  MusicProps,
  PlaylistPropsWithMusics,
  UserProps,
} from "@/utils/types";

export type ActionType = "artist" | "user" | "music" | "playlist";

export interface ActionMenuProps {
  readonly actionId: string;
  readonly actionType?: ActionType;
  readonly triggerClassName?: string;
  readonly label?: string;
  readonly playlist?: PlaylistPropsWithMusics;
  readonly music?: MusicProps;
  readonly user?: UserProps;
  readonly orderId?: number;
  readonly showGoToArtist?: boolean;
  readonly showGoToMusic?: boolean;
}
