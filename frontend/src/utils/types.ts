export interface Playlist {
  id: string;
  name: string;
  description?: string;
  image?: string;
  is_public: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UserProps {
  id: string;
  first_name?: string;
  last_name?: string;
  full_name: string;
  username: string;
  image?: string;
  playlists: Playlist[];
  created_at: Date;
  updated_at: Date;
}

export interface ArtistProps extends UserProps {
  about?: string;
  cover?: string;
  twitter_link?: string;
  instagram_link?: string;
  is_verified: boolean;
}

export interface MusicProps {
  id: string;
  title: string;
  artist: ArtistProps;
  release_date?: Date;
  image?: string;
  audio: string;
  created_at: Date;
}

export interface PlaylistMusicProps extends MusicProps {
  order_id: number[];
}

export interface PlaylistPropsWithMusics extends Playlist {
  musics: PlaylistMusicProps[];
  owner: UserProps;
  owner_is_artist: boolean;
}

export interface ArtistPropsWithMusics extends ArtistProps {
  musics: MusicProps[];
  playlists: Playlist[];
}
