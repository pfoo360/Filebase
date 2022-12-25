import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import AddFolder from "../components/AddFolder/AddFolder";
import Folder from "../components/Folder/Folder";
import Header from "../components/Header/Header";
import prisma from "../lib/prismadb";
import useFetchFolders from "../hooks/useFetchFolders";
import { HomeProps } from "../types/types";
//import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";

const Home: NextPage<HomeProps> = ({ parentFolderId }) => {
  const { data: session, status } = useSession();
  const {
    data: folders,
    isLoading,
    isFetching,
    isError,
    error,
  } = useFetchFolders({ parentFolderId, session });

  return (
    <>
      <Head>
        <title>
          {session?.user?.name ? `${session.user.name} home` : `Home`}
        </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="my-3 ml-4 mr-10 flex flex-row justify-end">
          <AddFolder parentFolderId={parentFolderId} path={[]} />
        </div>
        <div className="flex-1 bg-slate-700 rounded mx-2">
          {isLoading && (
            <div className="h-full w-full flex flex-col justify-center items-center text-slate-100">
              fetching folders...
            </div>
          )}
          {folders !== undefined && folders?.length > 0 ? (
            folders.map((folder) => (
              <Folder key={folder.id} {...{ ...folder, parentFolderId }} />
            ))
          ) : (
            <div className="h-full w-full flex flex-col justify-center items-center text-slate-100">
              hmmm... there doesn't seem to be anything here...
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session || !session?.user?.email) {
    return {
      redirect: {
        destination: `/signin?callbackUrl=${context.resolvedUrl}`,
        permanent: false,
      },
    };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user || !user?.id) return { notFound: true };

  // const folders = await prisma.folder.findMany({
  //   where: { parentFolderId: "null", userId: user.id },
  // });

  // const queryClient = new QueryClient();
  // await queryClient.prefetchQuery(["usersFolders"], () =>
  //   fetchUsersFolders(session)
  // );

  return {
    props: {
      session,
      parentFolderId: null,

      //dehydratedState: dehydrate(queryClient),
    },
  };
};
