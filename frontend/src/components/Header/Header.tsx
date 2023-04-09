import { useRouter } from "next/router";
import Link from "next/link";
import { House, SpotifyLogo } from "@phosphor-icons/react";

export function Header() {
  const router = useRouter();

  const navLinks = [
    {
      href: "/",
      label: "Início",
      title: "Ir para o início",
      icon: House,
    },
    // {
    //   href: "/my/library",
    //   label: "Biblioteca",
    //   title: "Ir para a biblioteca",
    //   icon: Headphones,
    // },
  ];

  return (
    <nav className="fixed inset-x-0 h-[72px] backdrop-blur-md bg-black/50 border-b border-zinc-300/20 z-[9999]">
      <ul className="flex gap-2 w-full h-full items-center m-auto max-w-[1600px] px-6">
        <li className="mr-3">
          <Link
            href="/"
            className="focus:outline-none group"
            title="Ir para o início"
          >
            <SpotifyLogo
              weight="fill"
              size={50}
              className="text-violet-600 group-focus:ring-2 ring-purple-400 rounded-full duration-200"
            />
          </Link>
        </li>
        {navLinks.map((navLink, i) => (
          <li key={i} className="w-12 sm:w-auto h-12 flex items-center">
            <Link
              href={navLink.href}
              title={navLink.title}
              className={`flex justify-center uppercase items-center gap-2 p-2 w-full h-full sm:w-auto sm:py-2 sm:px-4 rounded-full sm:rounded-3xl ${
                router.pathname === navLink.href
                  ? "text-purple-600"
                  : "text-inherit"
              } hover:text-purple-400 focus:outline-none focus:ring-2 focus:text-purple-400 ring-purple-400 active:opacity-70 duration-200`}
            >
              <navLink.icon size={24} weight="fill" />{" "}
              <span className="hidden sm:block font-bold">{navLink.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
