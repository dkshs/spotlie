import { Header } from "@/components/Header";
import { ListMusics, MusicProps } from "@/components/ListMusics";
import { ListSingers, SingerProps } from "@/components/ListSingers";
import { Meta } from "@/components/Meta";

export default function Home() {
  const musics: MusicProps[] = [
    {
      id: "1",
      title: "MISS YOU",
      singers: [
        {
          id: "1",
          name: "What The Phonk",
          img: "https://i.scdn.co/image/ab6761610000e5eb5279e2e8d4359d657db68e92",
        },
      ],
      cover: "https://spotify0.vercel.app/songs/cover/MISS%20YOU.jpg",
    },
    {
      id: "2",
      title: "MISS YOU",
      singers: [
        {
          id: "2",
          name: "What The Phonk",
          img: "https://i.scdn.co/image/ab6761610000e5eb5279e2e8d4359d657db68e92",
        },
      ],
      cover: "https://spotify0.vercel.app/songs/cover/MISS%20YOU.jpg",
    },
    {
      id: "3",
      title: "MISS YOU",
      singers: [
        {
          id: "3",
          name: "What The Phonk",
          img: "https://i.scdn.co/image/ab6761610000e5eb5279e2e8d4359d657db68e92",
        },
      ],
      cover: "https://spotify0.vercel.app/songs/cover/MISS%20YOU.jpg",
    },
    {
      id: "4",
      title: "MISS YOU",
      singers: [
        {
          id: "4",
          name: "What The Phonk",
          img: "https://i.scdn.co/image/ab6761610000e5eb5279e2e8d4359d657db68e92",
        },
      ],
      cover: "https://spotify0.vercel.app/songs/cover/MISS%20YOU.jpg",
    },
    {
      id: "5",
      title: "MISS YOU",
      singers: [
        {
          id: "5",
          name: "What The Phonk",
          img: "https://i.scdn.co/image/ab6761610000e5eb5279e2e8d4359d657db68e92",
        },
      ],
      cover: "https://spotify0.vercel.app/songs/cover/MISS%20YOU.jpg",
    },
    {
      id: "6",
      title: "MISS YOU",
      singers: [
        {
          id: "6",
          name: "What The Phonk",
          img: "https://i.scdn.co/image/ab6761610000e5eb5279e2e8d4359d657db68e92",
        },
      ],
      cover: "https://spotify0.vercel.app/songs/cover/MISS%20YOU.jpg",
    },
    {
      id: "7",
      title: "Time to Live and Time to Die",
      singers: [
        {
          id: "7",
          name: "IVOXYGEN",
          img: "https://i.scdn.co/image/ab6761610000e5eb94ba76c3be477ca3e0dcce96",
        },
      ],
      cover:
        "https://spotify0.vercel.app/songs/cover/IVOXYGEN%20-%20Time%20to%20Live%20and%20Time%20to%20Die.jpg",
    },
  ];
  const singers: SingerProps[] = [
    {
      id: "1",
      name: "IVOXYGEN",
      img: "https://i.scdn.co/image/ab6761610000e5eb94ba76c3be477ca3e0dcce96",
    },
    {
      id: "2",
      name: "IVOXYGEN",
      img: "https://i.scdn.co/image/ab6761610000e5eb94ba76c3be477ca3e0dcce96",
    },
    {
      id: "3",
      name: "What The Phonk",
      img: "https://i.scdn.co/image/ab6761610000e5eb5279e2e8d4359d657db68e92",
    },
    {
      id: "4",
      name: "IVOXYGEN",
      img: "https://i.scdn.co/image/ab6761610000e5eb94ba76c3be477ca3e0dcce96",
    },
    {
      id: "5",
      name: "IVOXYGEN",
      img: "https://i.scdn.co/image/ab6761610000e5eb94ba76c3be477ca3e0dcce96",
    },
    {
      id: "6",
      name: "IVOXYGEN",
      img: "https://i.scdn.co/image/ab6761610000e5eb94ba76c3be477ca3e0dcce96",
    },
  ];

  return (
    <>
      <Meta path="/" title="Home" />
      <Header />
      <div className="pt-[72px]">
        <ListMusics musics={musics} />
        <ListSingers singers={singers} />
      </div>
    </>
  );
}

// <div className="relative">
//   <div>
//     <div className="absolute h-[332px] w-full bg-purple-800 z-[-1] bg-gradient-to-b from-black/60 to-zinc-900 duration-300"></div>
//   </div>
// </div>
