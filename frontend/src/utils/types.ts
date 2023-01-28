export interface SingerProps {
  id: string;
  name: string;
  img: string;
}

export interface MusicProps {
  id: string;
  title: string;
  singers: SingerProps[];
  cover: string;
}
