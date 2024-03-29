import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { SignOutButtonProps } from "../../types/types";

function SignOutButton({ children }: SignOutButtonProps) {
  const { push } = useRouter();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/signin" });
    //push(url);
  };

  return (
    <button
      onClick={handleSignOut}
      className="px-3 py-1 rounded text-base text-slate-100 bg-amber-300 hover:bg-amber-400"
    >
      {children}
    </button>
  );
}

export default SignOutButton;
