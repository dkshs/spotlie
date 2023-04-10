import { useRouter } from "next/router";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
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
      <ul className="flex gap-2 justify-between w-full h-full items-center m-auto max-w-[1600px] px-6">
        <div className="flex">
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
                <span className="hidden sm:block font-bold">
                  {navLink.label}
                </span>
              </Link>
            </li>
          ))}
        </div>
        <div className="flex items-end">
          <SignedOut>
            <Link
              href="/sign-in/[[...index]]"
              className={`flex justify-center uppercase items-center gap-2 p-2 w-full h-full sm:w-auto sm:py-2 sm:px-4 rounded-full sm:rounded-3xl ${
                router.pathname === "/sign-in/[[...index]]"
                  ? "text-purple-600"
                  : "text-inherit"
              } hover:text-purple-400 focus:outline-none focus:ring-2 focus:text-purple-400 ring-purple-400 active:opacity-70 duration-200`}
            >
              Login
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton
              userProfileMode="modal"
              appearance={{
                elements: { card: "bg-black/80 backdrop-blur-xl" },
                userProfile: {
                  elements: {
                    modalBackdrop: "bg-black/50 backdrop-blur-2xl max-h-screen",
                    modalContent: "m-0",
                    card: "bg-black/50 backdrop-blur-xl",
                    profileSectionPrimaryButton:
                      "hover:bg-violet-600/10 duration-300",
                    accordionTriggerButton: "hover:bg-gray-600/10 duration-300",
                    formButtonReset: "hover:bg-violet-600/20 duration-300",
                    fileDropAreaButtonPrimary:
                      "hover:bg-violet-600/20 duration-300",
                  },
                },
              }}
            />
          </SignedIn>
        </div>
      </ul>
    </nav>
  );
}
