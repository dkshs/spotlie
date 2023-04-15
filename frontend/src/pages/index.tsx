import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

import type { ArtistProps, MusicProps } from "@/utils/types";

import { ListArtists } from "@/components/ListArtists";
import { ListMusics } from "@/components/ListMusics";
import { Meta } from "@/components/Meta";

export default function Home() {
  const { data: musics, isFetching: isFetchingMusics } = useQuery<MusicProps[]>(
    {
      queryKey: ["home-musics"],
      queryFn: async () => {
        try {
          const { data } = await api.get("/musics?limit=10");
          return data || [];
        } catch (err) {
          console.error(err);
          return [];
        }
      },
      staleTime: 1000 * 60 * 5,
    },
  );

  const { data: artists, isFetching: isFetchingArtists } = useQuery<
    ArtistProps[]
  >({
    queryKey: ["home-artists"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/artists?limit=10");
        return data || [];
      } catch (err) {
        console.error(err);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  return (
    <>
      <Meta
        path="/"
        title="Home"
        description="Navegue e ouça agora suas músicas e podcasts favoritos no navegador da Web."
        image={{ src: "/logo.png", alt: "Logo do SpotLie" }}
      />
      <ListMusics musics={musics} isFetching={isFetchingMusics} />
      <ListArtists artists={artists} isFetching={isFetchingArtists} />
    </>
  );
}
