import type { SingerProps } from "@/utils/types";

import Link from "next/link";
import { SingerCard } from "../SingerCard";

interface ListSingersProps {
  singers: SingerProps[];
}

export function ListSingers({ singers }: ListSingersProps) {
  return (
    <section className="px-9 mt-8">
      <header className="flex justify-between mb-4 items-center">
        <h1 className="font-bold text-xl">Cantores</h1>
        <Link
          href="/singers"
          className="bg-purple-800 py-1.5 px-4 rounded-3xl hover:scale-105 hover:bg-purple-600 focus:outline-none focus:ring-2 ring-blue-300 active:bg-purple-600/20 duration-200"
        >
          <span className="uppercase text-sm font-bold">Ver mais</span>
        </Link>
      </header>
      <div className="pb-3 flex flex-1 gap-8 overflow-x-auto w-[calc(100% - 20px)] snap-x snap-mandatory">
        {singers.map((singer) => (
          <SingerCard key={singer.id} {...singer} />
        ))}
      </div>
    </section>
  );
}
