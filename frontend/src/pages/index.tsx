import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { MusicProps, SingerProps } from "@/utils/types";

import { Meta } from "@/components/Meta";
import { ListMusics } from "@/components/ListMusics";
import { ListSingers } from "@/components/ListSingers";

export default function Home() {
  const { data: musics, isFetching: musicsIsFetching } = useQuery<MusicProps[]>(
    {
      queryKey: ["musics"],
      queryFn: async () => {
        const response = await api.get("/musics?limit=10");
        return response.data;
      },
      staleTime: 1000 * 60,
    },
  );

  const { data: singers, isFetching: singerIsFetching } = useQuery<
    SingerProps[]
  >({
    queryKey: ["singers"],
    queryFn: async () => {
      const response = await api.get("/singers?limit=10");
      return response.data;
    },
    staleTime: 1000 * 60,
  });

  return (
    <>
      <Meta path="/" title="Home" />
      <ListMusics musics={musics} isFetching={musicsIsFetching} />
      <ListSingers singers={singers} isFetching={singerIsFetching} />
    </>
  );
}

// <div className="relative">
//   <div>
//     <div className="absolute h-[332px] w-full bg-purple-800 z-[-1] bg-gradient-to-b from-black/60 to-zinc-900 duration-300"></div>
//   </div>
// </div>
