import type { SingerProps } from "@/utils/types";

import Link from "next/link";
import { SingerCard } from "../SingerCard";

interface ListSingersProps {
  singers?: SingerProps[];
  isFetching?: boolean;
}

export function ListSingers({ singers, isFetching }: ListSingersProps) {
  const skeletonItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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
        {!singers || isFetching
          ? skeletonItems.map((i) => (
              <div
                key={i}
                className="py-1 max-w-[178px] snap-center min-h-[206px]"
              >
                <div className="rounded-lg overflow-hidden block min-h-[178px] min-w-[178px]">
                  <div className="aspect-square bg-black/20 animate-pulse" />
                </div>
                <div className="flex flex-col mt-2 gap-0.5 text-base font-normal truncate">
                  <span className="h-6 w-1/2 bg-black/20 animate-pulse" />
                </div>
              </div>
            ))
          : singers.map((singer) => (
              <SingerCard key={singer.id} singer={singer} />
            ))}
      </div>
    </section>
  );
}
