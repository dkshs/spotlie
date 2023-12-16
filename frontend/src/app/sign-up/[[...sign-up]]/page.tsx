import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignUpPage() {
  return (
    <div className="my-20 flex items-center justify-center">
      <SignUp path="/sign-up" routing="path" />
    </div>
  );
}
