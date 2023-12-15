import type { Metadata } from "next";
import { PageError } from "@/components/PageError";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function PageNotFound() {
  const title = "Page Not Found";
  const description = "The page you are looking for does not exist.";

  return <PageError title={title} description={description} />;
}
