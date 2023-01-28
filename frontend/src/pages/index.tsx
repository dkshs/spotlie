import { ListMusics } from "@/components/ListMusics";
import { ListSingers } from "@/components/ListSingers";
import { Meta } from "@/components/Meta";
import { musics } from "@/utils/musics";
import { singers } from "@/utils/singers";

export default function Home() {
  return (
    <>
      <Meta path="/" title="Home" />
      <ListMusics musics={musics} />
      <ListSingers singers={singers} />
    </>
  );
}

// <div className="relative">
//   <div>
//     <div className="absolute h-[332px] w-full bg-purple-800 z-[-1] bg-gradient-to-b from-black/60 to-zinc-900 duration-300"></div>
//   </div>
// </div>
