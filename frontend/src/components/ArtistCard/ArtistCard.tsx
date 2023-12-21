import type { ArtistProps } from "@/utils/types";

import { cn } from "@/lib/utils";

import Image from "next/image";
import Link from "next/link";

interface ArtistCardProps {
  artist: ArtistProps;
  variant?: "vertical" | "horizontal";
}

export function ArtistCard({ artist, variant = "vertical" }: ArtistCardProps) {
  return (
    <Link
      href={`/artist/${artist.id}`}
      className={cn(
        "group relative flex snap-center items-center rounded-lg bg-secondary/50 ring-ring duration-200 focus:outline-none focus:ring-2",
        variant === "vertical"
          ? "h-60 w-40 flex-col gap-4 p-2 md:h-72 md:w-52 md:p-4"
          : "h-16 gap-3 px-2 py-1",
      )}
    >
      <div className="absolute inset-0 z-[-1] size-full scale-95 rounded-lg bg-secondary opacity-0 duration-300 group-focus-within:scale-100 group-focus-within:opacity-100 group-hover:scale-100 group-hover:opacity-100" />
      <div
        className={cn(
          "relative overflow-hidden rounded-lg bg-background bg-gradient-to-tr from-background/60 to-primary/20 shadow-lg shadow-background/60",
          variant === "vertical"
            ? "h-[65%] min-h-[65%] w-36 md:w-44"
            : "size-[50px] min-h-[50px] min-w-[50px]",
        )}
      >
        {artist.image && (
          <Image
            alt={artist.username}
            src={artist.image}
            className="aspect-square object-cover"
            fill
          />
        )}
      </div>
      <h3 className="w-full truncate rounded-lg text-lg font-bold hover:underline">
        {artist.username}
      </h3>
    </Link>
  );
}
