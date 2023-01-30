import type { SingerProps } from "@/utils/types";

import Image from "next/image";
import Link from "next/link";
import { User } from "phosphor-react";

export function SingerCard(singer: SingerProps) {
  return (
    <div key={singer.id} className="py-1 max-w-[178px] snap-center">
      <Link
        href={`/singer/${singer.id}`}
        className="relative rounded-lg overflow-hidden block min-h-[178px] min-w-[178px] bg-black/40 hover:opacity-70 duration-300"
      >
        {singer.image ? (
          <Image
            className="aspect-square object-cover shadow-xl shadow-black/60 hover:opacity-50 duration-300"
            src={singer.image}
            alt={singer.name}
            width={178}
            height={178}
          />
        ) : (
          <User className="w-full h-full hover:opacity-70 duration-300" />
        )}
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
  );
}
