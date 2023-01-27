import Head from "next/head";
import Link from "next/link";

const title = "Página não encontrada";
const description =
  "Não foi possível encontrar a página que você está procurando.";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <section className="flex text-center flex-col justify-center items-center pt-20">
        <h1 className="text-2xl pt-10 mb-2">{description}</h1>
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
    </>
  );
}
