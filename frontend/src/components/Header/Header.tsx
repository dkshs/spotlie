import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { House, MusicNotes } from "phosphor-react";

export function Header() {
  const router = useRouter();

  const navLinks = [
    {
      href: "/",
      label: "Início",
      icon: House,
    },
    {
      href: "/musics",
      label: "Músicas",
      icon: MusicNotes,
    },
  ];

  return (
    <nav className="fixed w-full h-[72px] backdrop-blur bg-black/30 border-b border-zinc-300/20">
      <ul className="flex gap-2 w-full h-full items-center max-w-7xl m-auto px-6 2xl:px-0">
        <li className="mr-3">
          <Link href="/" className="outline-blue-300 duration-200 rounded-full">
            <Image
              src="/logo.png"
              alt="Logo do Spotify Zero"
              width={40}
              height={40}
            />
          </Link>
        </li>
        {navLinks.map((navLink, i) => (
          <li key={i} className="w-12 sm:w-auto h-12 flex items-center">
            <Link
              href={navLink.href}
              className={`flex justify-center uppercase items-center gap-2 p-2 w-full h-full sm:w-auto sm:py-2 sm:px-4 rounded-full sm:rounded-3xl ${
                router.pathname === navLink.href
                  ? "text-purple-600"
                  : "text-inherit"
              } hover:text-purple-400 focus:outline-none focus:ring-2 focus:text-purple-400 ring-blue-300 active:opacity-70 active:ring-0 duration-200`}
            >
              <navLink.icon size={24} weight="bold" />{" "}
              <span className="hidden sm:block">{navLink.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
