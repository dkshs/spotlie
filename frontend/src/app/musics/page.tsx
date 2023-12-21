import type { Metadata } from "next";

import { MusicsList } from "./MusicsList";

export const metadata: Metadata = {
  title: "Musics",
  alternates: {
    canonical: "musics",
  },
  openGraph: {
    url: "musics",
  },
  twitter: {
    title: "Musics",
  },
};

export default function MusicsPage() {
  return (
    <div className="mb-8 mt-6 px-4 lg:px-9">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Musics</h1>
      </div>
      <MusicsList />
    </div>
  );
}
