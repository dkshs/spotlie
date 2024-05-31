import type { MusicProps, PlaylistPropsWithMusics, UserProps } from "./types";

import { v4 } from "uuid";

export function turnMusicsInPlaylist(
  musics: MusicProps[],
  user?: UserProps,
): PlaylistPropsWithMusics {
  const plMusics = musics.map((music, i) => ({ ...music, order_id: i }));

  return {
    id: v4(),
    name: "name",
    is_public: false,
    musics: plMusics,
    owner: {
      id: "id",
      full_name: "full_name",
      username: "user",
      playlists: [],
      created_at: new Date(),
      updated_at: new Date(),
      ...user,
    },
    owner_is_artist: false,
    created_at: new Date(),
    updated_at: new Date(),
  };
}

export function createLikedMusicsPlaylist(
  musics: MusicProps[],
  user?: UserProps,
): PlaylistPropsWithMusics {
  const plMusics = musics.map((music, i) => ({ ...music, order_id: i }));

  return {
    id: v4(),
    name: "Liked Musics",
    is_public: false,
    musics: plMusics,
    owner: {
      id: "id",
      full_name: "full_name",
      username: "XXXX",
      playlists: [],
      created_at: new Date(),
      updated_at: new Date(),
      ...user,
    },
    owner_is_artist: false,
    created_at: new Date(),
    updated_at: new Date(),
  };
}
