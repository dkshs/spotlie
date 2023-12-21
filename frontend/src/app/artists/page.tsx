import type { Metadata } from "next";

import { ArtistsList } from "./ArtistsList";

export const metadata: Metadata = {
  title: "Artists",
  alternates: {
    canonical: "artists",
  },
  openGraph: {
    url: "artists",
  },
  twitter: {
    title: "Artists",
  },
};

export default function ArtistsPage() {
  return (
    <div className="mb-8 mt-6 px-4 lg:px-9">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Artists</h1>
      </div>
      <ArtistsList />
    </div>
  );
}
