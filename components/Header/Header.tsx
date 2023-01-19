import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-regular-svg-icons";
import { useSession } from "next-auth/react";
import SignOutButton from "../SignOutButton/SignOutButton";
import Link from "next/link";
import Image from "next/image";

function Header() {
  const { data: session, status } = useSession();
  return (
    <div className="w-full h-12 bg-slate-400 flex flex-row justify-between items-center text-slate-100 text-3xl">
      <Link
        href="/"
        className="hover:text-amber-400 h-full w-10 mx-4 flex flex-row justify-center items-center"
      >
        <FontAwesomeIcon icon={faFolder} />
      </Link>
      <div className="flex flex-row justify-end items-center mx-6 h-full flex-1">
        {session?.user?.name ? (
          <div className="text-base mx-4 flex flex-row items-center">
            <div className="mr-2">hello, {session.user.name}</div>
            {session?.user?.image ? (
              <Image
                src={session?.user.image}
                width={30}
                height={30}
                alt={`${session.user.name}'s profile picture`}
                className="rounded-full"
              />
            ) : null}
          </div>
        ) : null}
        <SignOutButton>sign out</SignOutButton>
      </div>
    </div>
  );
}

export default Header;
