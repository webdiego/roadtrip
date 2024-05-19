import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center h-screen self-center">
      <SignUp path="/sign-up" />
    </div>
  );
}
