export interface ArtistProps {
  id: string;
  name: string;
  image: string;
}

export interface MusicProps {
  id: string;
  title: string;
  artist: ArtistProps;
  participants: ArtistProps[];
  letters: string;
  cover: string;
  audio: string;
}
