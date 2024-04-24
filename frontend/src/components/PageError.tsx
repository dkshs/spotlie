import NextLink from "next/link";
import { Link } from "./ui/Link";

interface PageErrorProps {
  readonly title: string;
  readonly description: string;
}

export function PageError({ title, description }: PageErrorProps) {
  return (
    <main className="mt-20 flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold tracking-wide">{title}</h1>
      <p className="mt-4 text-lg">{description}</p>
      <p className="mt-2 text-base">
        Go back to the{" "}
        <Link asChild href="/">
          <NextLink href="/">home</NextLink>
        </Link>
        .
      </p>
    </main>
  );
}
