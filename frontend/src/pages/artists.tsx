import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

import type { ArtistProps } from "@/utils/types";

import { Meta } from "@/components/Meta";
import { SimpleArtistCard } from "@/components/ArtistCard";

export default function ArtistsPage() {
  const skeletonItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [query, setQuery] = useState("");

  const { data: artists, isFetching } = useQuery<ArtistProps[]>({
    queryKey: ["musics"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/artists");
        return data || [];
      } catch (err) {
        return [];
      }
    },
  });

  const filteredArtists =
    query === ""
      ? artists
      : artists?.filter((artist) =>
          artist.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, "")),
        );

  return (
    <>
      <Meta title="Artistas" path="/artists" />
      <div className="px-4 sm:px-9 mt-6">
        <div className="flex gap-2 flex-wrap justify-between items-center">
          <h1 className="text-2xl font-bold">Artistas</h1>
          <label className="sr-only" htmlFor="searchForArtist">
            Procure por um artista
          </label>
          <input
            type="text"
            placeholder="Procure por um artista..."
            id="searchForArtist"
            className="bg-black/30 pl-4 pr-2 sm:px-5 py-2 rounded-3xl focus:outline-none focus:ring-2 ring-purple-500"
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div
          className={`${
            filteredArtists?.length === 0 && query !== "" ? "flex" : "grid"
          } grid-cols-1 sm:grid-cols-2 gap-1 pt-6`}
        >
          {isFetching || !filteredArtists ? (
            skeletonItems.map((i) => (
              <div
                key={i}
                className="flex items-start px-4 py-2 rounded-md gap-3"
              >
                <div className="relative rounded-lg min-w-[50px] min-h-[50px]">
                  <div className="rounded-lg w-[50px] h-[50px] bg-black/40 animate-pulse" />
                </div>
                <span className="mt-1 h-6 w-1/3 bg-black/20 rounded-lg animate-pulse" />
              </div>
            ))
          ) : filteredArtists?.length === 0 && query !== "" ? (
            <div className="flex flex-col w-full justify-center py-4 px-4">
              <span className="text-center mt-4">
                Nenhum artista encontrado
              </span>
            </div>
          ) : (
            filteredArtists.map((artist) => (
              <SimpleArtistCard key={artist.id} artist={artist} />
            ))
          )}
        </div>
      </div>
    </>
  );
}
