import type { NextPage } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Provider, HandleOAuthSignIn } from "../../types/types";

const PROVIDERS: Provider[] = [
  { provider: "github", name: "GitHub", icon: faGithub },
];

const SignIn: NextPage = () => {
  const { query, push } = useRouter();
  const { callbackUrl } = query;
  const { data: session, status } = useSession();

  const handleOAuthSignIn: HandleOAuthSignIn = (provider) => () => {
    signIn(provider, { callbackUrl: callbackUrl || "/" });
  };

  if (status === "loading")
    return (
      <h1 className="text-xl text-slate-200 flex flex-col h-screen justify-center items-center">
        checking authentication...
      </h1>
    );

  if (session) {
    setTimeout(() => {
      push("/");
    }, 1500);
    return (
      <h1 className="text-xl text-slate-200 flex flex-col h-screen justify-center items-center">
        You are already signed in. Redirecting to home...
      </h1>
    );
  }

  return (
    <>
      <Head>
        <title>Filebase sign in</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="flex flex-col h-screen justify-center items-center">
        {PROVIDERS.map(({ provider, name, icon }) => (
          <button
            key={provider}
            onClick={handleOAuthSignIn(provider)}
            className="bg-slate-400 rounded text-slate-800 px-4 py-2 hover:bg-slate-200 text-lg"
          >
            <FontAwesomeIcon icon={icon} className="mr-2" />
            {`Sign in with ${name}`}
          </button>
        ))}
      </div>
    </>
  );
};

export default SignIn;
