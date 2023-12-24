"use client";

import type { MusicProps } from "@/utils/types";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";

import { MusicCard } from "@/components/MusicCard";
import { Button } from "@/components/ui/Button";

import { Spinner } from "@phosphor-icons/react";

export function MusicsList() {
  const router = useRouter();
  const [musics, setMusics] = useState<MusicProps[]>([]);
  const [offset, setOffset] = useState(0);
  const { fetcher } = useApi();
  const skeletons = [...Array(12).keys()].map((i) => i + 1);

  const { isFetching, refetch } = useQuery<MusicProps[]>({
    queryKey: ["musics"],
    queryFn: async () => {
      try {
        const qtd = skeletons.length;
        const data = await fetcher<MusicProps[]>("/musics/", {
          searchParams: { limit: `${qtd}`, offset: `${qtd * offset}` },
        });
        const newMusics = [...new Set([...musics, ...data])];
        if (newMusics.length !== musics.length) {
          setMusics(newMusics);
          setOffset((prevOffset) => prevOffset + 1);
        }
        return data || [];
      } catch (err) {
        return [];
      }
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 gap-1 pt-6 sm:grid-cols-2 lg:grid-cols-3">
        {isFetching && musics.length === 0 ? (
          skeletons.map((i) => (
            <div
              key={i}
              className="flex h-16 w-full animate-pulse items-center gap-3 rounded-lg bg-muted/40 px-2 py-1"
            >
              <div className="aspect-square size-[50px] rounded-lg bg-background bg-gradient-to-tr from-background/60 to-primary/20 shadow-lg shadow-background/60" />
              <div className="flex w-full flex-col items-start gap-2">
                <div className="h-4 w-1/2 rounded-md bg-muted/80" />
                <div className="h-4 w-2/5 rounded-md bg-muted/80" />
              </div>
            </div>
          ))
        ) : !musics ? (
          <p>No musics</p>
        ) : (
          musics.map((music) => (
            <MusicCard
              key={music.id}
              music={music}
              musics={musics}
              orientation="horizontal"
              showGoToArtist
              showGoToMusic
            />
          ))
        )}
      </div>
      {!isFetching &&
        musics &&
        musics.length >= skeletons.length &&
        musics.length % 2 === 0 && (
          <div className="flex w-full justify-center">
            <Button
              onClick={async () => {
                await refetch();
                router.push(`/musics#${musics[musics.length - 1]?.id}`);
              }}
              className="mt-4 size-fit"
              radius="full"
            >
              {isFetching ? (
                <Spinner size={20} className="animate-spin" />
              ) : (
                "Load more"
              )}
            </Button>
          </div>
        )}
    </div>
  );
}
