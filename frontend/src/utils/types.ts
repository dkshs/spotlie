export interface SingerProps {
  id: string;
  name: string;
  image: string;
}

export interface MusicProps {
  id: string;
  title: string;
  singers: SingerProps[];
  cover: string;
}
