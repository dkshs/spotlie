import { useQuery } from "@tanstack/react-query";
import { useMusic } from "@/hooks/useMusic";
import { useRouter } from "next/router";
import { useApi } from "@/hooks/useApi";

import type { MusicProps, ArtistProps } from "@/utils/types";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Meta } from "@/components/Meta";
import { SimpleMusicCard } from "@/components/MusicCard";

import { Pause, Play } from "@phosphor-icons/react";

interface ArtistRequestProps {
  artist: ArtistProps | null;
  artistMusics: MusicProps[];
}

export default function ArtistPage() {
  const { libApi } = useApi();
  const { currentMusic, musicState, playMusic, pauseMusic } = useMusic();
  const {
    query: { id },
  } = useRouter();

  const {
    data: artist,
    isFetching,
    isLoading,
  } = useQuery<ArtistRequestProps | null>({
    queryKey: [`artist-${id}`],
    queryFn: async () => {
      try {
        let artistMusics: MusicProps[] = [];
        const { data: artist } = await libApi
          .from("artists")
          .select<ArtistProps>("*", {
            eq: { column: "id", value: id as string },
          });
        if (artist) {
          const { data: musics } = await libApi
            .from("musics")
            .select<MusicProps[]>("*", {
              like: { column: "artist", value: artist.name },
              limit: 10,
            });
          artistMusics = musics || [];
        }
        return { artist, artistMusics };
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    staleTime: 1000 * 60,
  });

  return (
    <div className="px-4 sm:px-9 mt-10 md:mt-20 mb-20">
      {isFetching || isLoading ? (
        <div className="flex flex-col justify-center text-center md:justify-start md:text-start md:flex-row md:min-h-[280px]">
          <div className="self-center md:mr-8 rounded-full bg-black/50 md:min-h-[280px] flex justify-center animate-pulse">
            <div className="min-w-[280px] min-h-[280px] object-cover rounded-full" />
          </div>
          <div className="flex flex-col mt-12 md:pt-12 md:mt-auto gap-2 md:min-h-[280px] w-full">
            <div className="flex flex-col gap-2">
              <small className="font-extrabold text-xs md:mt-4 uppercase text-white">
                Artista
              </small>
              <span className="mb-2 md:mb-3 md:mt-2 h-9 self-center md:self-start bg-black/30 inline-block w-1/3 rounded-md" />
              <div className="md:mt-5 self-center md:self-start">
                <div className="flex w-12 h-12 items-center p-3 bg-purple-700 rounded-full hover:bg-purple-600 shadow-md hover:shadow-purple-800/50 hover:scale-105 active:opacity-70 active:scale-100 focus:outline-none focus:ring-2 ring-purple-400 ring-offset-black ring-offset-2 duration-300" />
              </div>
            </div>
          </div>
        </div>
      ) : artist && artist.artist ? (
        <>
          <div className="flex flex-col justify-center text-center md:justify-start md:text-start md:flex-row md:min-h-[280px]">
            <div
              className="absolute bg-cover inset-0 bg-center bg-no-repeat md:h-96 z-[-1] blur-3xl opacity-50"
              style={
                artist.artist.image
                  ? {
                      backgroundImage: `url(${artist.artist.image})`,
                    }
                  : {}
              }
            ></div>
            <Meta
              title={artist.artist.name}
              path={`/artist/${id}`}
              description={`Ouça as músicas de ${artist.artist.name}.`}
              baseUrl=""
              image={{
                src: artist.artist.image || "",
                alt: artist.artist.name,
              }}
            />
            <div className="self-center md:mr-8 rounded-full bg-black/50 md:min-h-[280px] flex justify-center">
              {artist.artist.image && (
                <Image
                  src={artist.artist.image}
                  alt={artist.artist.name}
                  className="shadow-xl rounded-full shadow-black/40 object-cover aspect-square"
                  width={280}
                  height={280}
                  priority
                />
              )}
            </div>
            <div className="flex flex-col mt-12 md:pt-12 md:mt-auto gap-2 md:min-h-[280px]">
              <div className="flex flex-col gap-2">
                <small className="font-extrabold text-xs md:mt-4 uppercase text-white">
                  ARTISTA
                </small>
                <h1 className="font-extrabold font-sans text-3xl break-words">
                  {artist.artist.name}
                </h1>
                {artist.artistMusics && artist.artistMusics.length > 0 && (
                  <div className="mt-2 md:mt-10 self-center md:self-start">
                    <button
                      type="button"
                      title={`${
                        musicState === "playing" &&
                        currentMusic?.artist.name === artist.artist.name
                          ? "Pausar"
                          : "Reproduzir"
                      }`}
                      onClick={() =>
                        musicState === "playing" &&
                        currentMusic?.artist.name === artist.artist?.name
                          ? pauseMusic()
                          : playMusic(
                              artist.artistMusics[0],
                              artist.artistMusics,
                            )
                      }
                      className="flex items-center p-3 bg-purple-700 rounded-full hover:bg-purple-600 shadow-md hover:shadow-purple-800/50 hover:scale-105 active:opacity-70 active:scale-100 focus:outline-none focus:ring-2 ring-purple-400 ring-offset-black ring-offset-2 duration-300"
                    >
                      {musicState === "playing" &&
                      currentMusic?.artist.name === artist.artist.name ? (
                        <Pause size={24} weight="fill" />
                      ) : (
                        <Play size={24} weight="fill" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <section className="md:px-9 mt-14">
            <header className="flex justify-between items-center">
              <h1 className="font-bold text-xl">Músicas</h1>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 pt-6">
              {artist.artistMusics && artist.artistMusics.length > 0 ? (
                artist.artistMusics.map((music) => (
                  <SimpleMusicCard
                    key={music.id}
                    music={music}
                    showArtist={false}
                    playlist={artist.artistMusics}
                  />
                ))
              ) : (
                <p>O artista {artist.artist.name} não tem músicas!</p>
              )}
            </div>
          </section>
        </>
      ) : (
        <div className="flex flex-col justify-center text-center md:justify-start md:text-start md:flex-row md:min-h-[280px]">
          <Head>
            <title>
              Não foi possível encontrar o artista que você está procurando.
            </title>
          </Head>
          <section className="flex text-center flex-col w-full">
            <h1 className="text-2xl pt-10 mb-2">
              Não foi possível encontrar o artista que você está procurando.
            </h1>
            <p className="text-lg mt-2">
              Por favor, volte para a{" "}
              <Link
                href="/"
                className="text-blue-300 hover:text-blue-200 hover:underline underline-offset-2 active:opacity-70"
              >
                página inicial do Spotify Zero
              </Link>
              .
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
