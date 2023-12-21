export interface UserProps {
  id: string;
  username: string;
  image?: string;
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

export interface ArtistPropsWithMusics extends ArtistProps {
  musics: MusicProps[];
}
