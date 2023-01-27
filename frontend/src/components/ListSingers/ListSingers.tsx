import Image from "next/image";
import Link from "next/link";

export interface SingerProps {
  id: string;
  name: string;
  img: string;
}

export interface ListSingersProps {
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
          <div key={singer.id} className="py-1 max-w-[178px] snap-center">
            <Link
              href={`/singer/${singer.id}`}
              className="relative rounded-lg overflow-hidden block min-h-[178px] min-w-[178px]"
            >
              <Image
                className="aspect-square object-cover shadow-xl shadow-black/60 hover:opacity-50 duration-300"
                src={singer.img}
                alt="Capa da música"
                width={178}
                height={178}
                priority
              />
            </Link>
            <div className="flex flex-col mt-2 gap-0.5 text-base font-normal truncate">
              <Link
                href={`/singer/${singer.id}`}
                className="truncate pr-2.5 focus:text-purple-400 hover:text-purple-400 active:opacity-70 duration-200"
              >
                {singer.name}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
