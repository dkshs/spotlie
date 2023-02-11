import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { MusicProps, ArtistProps } from "@/utils/types";

import { Meta } from "@/components/Meta";
import { ListMusics } from "@/components/ListMusics";
import { ListArtists } from "@/components/ListArtists";

export default function Home() {
  const { data: musics, isFetching: isFetchingMusics } = useQuery<MusicProps[]>(
    {
      queryKey: ["musics"],
      queryFn: async () => {
        try {
          const { data } = await api.get("/musics?limit=10");
          return data;
        } catch (err) {
          return [];
        }
      },
      staleTime: 1000 * 60,
    },
  );

  const { data: artists, isFetching: isFetchingArtists } = useQuery<
    ArtistProps[]
  >({
    queryKey: ["artists"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/artists?limit=10");
        return data;
      } catch (err) {
        return [];
      }
    },
    staleTime: 1000 * 60,
  });

  return (
    <>
      <Meta
        path="/"
        title="Home"
        description="Navegue e ouça agora suas músicas e podcasts favoritos no navegador da Web."
        image={{ src: "/logo.png", alt: "Logo do Spotify0" }}
      />
      <ListMusics musics={musics} isFetching={isFetchingMusics} />
      <ListArtists artists={artists} isFetching={isFetchingArtists} />
    </>
  );
}

// <div className="relative">
//   <div>
//     <div className="absolute h-[332px] w-full bg-purple-800 z-[-1] bg-gradient-to-b from-black/60 to-zinc-900 duration-300"></div>
//   </div>
// </div>
