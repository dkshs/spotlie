import { MusicProps } from "./types";
import { singers } from "./singers";

export const musics: MusicProps[] = [
  {
    id: "1",
    title: "MISS YOU",
    singers: [singers[1]],
    cover: "https://spotify0.vercel.app/songs/cover/MISS%20YOU.jpg",
  },
  {
    id: "2",
    title: "Time to Live and Time to Die",
    singers: [singers[0]],
    cover: "https://i.scdn.co/image/ab67616d00001e021f9ec98c256244323f9b7ac1",
  },
  {
    id: "3",
    title: "All Alone",
    singers: [singers[0]],
    cover: "https://i.scdn.co/image/ab67616d00001e025b3e3b04fcfa8c1f5ffb0350",
  },
  {
    id: "4",
    title: "Leave Your Zone",
    singers: [singers[2]],
    cover: "https://i.scdn.co/image/ab67616d00001e022812cf002deeaccd54b68ef5",
  },
];
