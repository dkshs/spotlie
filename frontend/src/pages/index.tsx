import { Header } from "@/components/Header";
import { Meta } from "@/components/Meta";

export default function Home() {
  return (
    <>
      <Meta path="/" title="Home" />
      <Header />
    </>
  );
}

// <div className="relative">
//   <div>
//     <div className="absolute h-[332px] w-full bg-purple-800 z-[-1] bg-gradient-to-b from-black/60 to-zinc-900 duration-300"></div>
//   </div>
// </div>
