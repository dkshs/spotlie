import { Meta } from "@/components/Meta";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <>
      <Meta path="/sign-up" title="Criar Conta" />
      <div className="my-10 flex justify-center items-center">
        <SignUp
          path="/sign-up"
          routing="path"
          appearance={{
            elements: {
              card: "bg-black/80 backdrop-blur-xl",
              socialButtonsBlockButton:
                "hover:bg-violet-600/10 focus:bg-violet-600/30 duration-300",
              formButtonPrimary:
                "bg-violet-600/60 hover:bg-violet-600/80 duration-300",
            },
          }}
        />
      </div>
    </>
  );
}
