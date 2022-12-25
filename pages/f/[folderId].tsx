import type { NextPage, GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import Head from "next/head";
import prisma from "../../lib/prismadb";
import React from "react";
import AddFolder from "../../components/AddFolder/AddFolder";
import Header from "../../components/Header/Header";
import AddFile from "../../components/AddFile/AddFile";
import { useSession } from "next-auth/react";
import useFetchFolders from "../../hooks/useFetchFolders";
import useFetchFiles from "../../hooks/useFetchFiles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faArrowAltCircleLeft,
} from "@fortawesome/free-regular-svg-icons";
import Folder from "../../components/Folder/Folder";
import File from "../../components/File/File";
import Link from "next/link";
import { FolderIdProps, Folder as FolderType } from "../../types/types";

const FolderId: NextPage<FolderIdProps> = ({ user, parentFolder }) => {
  const { data: session, status } = useSession();
  const currentFolder: FolderType = JSON.parse(parentFolder);
  const previousFolderId = currentFolder.path[currentFolder.path.length - 1];

  const {
    data: folders,
    isLoading: isLoadingFolders,
    isFetching: isFetchingFolders,
    isError: isErrorFolders,
    error: errorFolders,
  } = useFetchFolders({ parentFolderId: currentFolder.id, session });

  const {
    data: files,
    isLoading: isLoadingFiles,
    isFetching: isFetchingFiles,
    isError: isErrorFiles,
    error: errorFiles,
  } = useFetchFiles({ parentFolderId: currentFolder.id, session });

  return (
    <>
      <Head>
        <title>{currentFolder?.name ? currentFolder.name : "Folder"}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="my-3 mx-4 flex flex-row justify-between items-center">
          <div className="text-2xl text-slate-100 flex flex-row items-center ml-3 w-1/2 overflow-hidden">
            <Link
              href={
                currentFolder.path[currentFolder.path.length - 1]
                  ? `/f/${previousFolderId}`
                  : `/`
              }
            >
              <FontAwesomeIcon
                icon={faArrowAltCircleLeft}
                className="bg-cyan-400 px-4 py-1 rounded hover:bg-cyan-600"
              />
            </Link>
            <FontAwesomeIcon icon={faFolderOpen} className="mx-2" />
            <h1>{currentFolder.name}</h1>
          </div>
          <div className="flex flex-row justify-end items-center flex-1 mr-6">
            <div className="mx-2">
              <AddFile
                currentFolder={currentFolder}
                currentUser={user}
                path={[...currentFolder.path, currentFolder.id]}
              />
            </div>
            <AddFolder
              parentFolderId={currentFolder.id}
              path={[...currentFolder.path, currentFolder.id]}
            />
          </div>
        </div>

        <div className="flex-1 bg-slate-700 rounded mx-2">
          {isLoadingFolders || isLoadingFiles ? (
            <div className="h-full w-full flex flex-col justify-center items-center text-slate-100">
              Loading...
            </div>
          ) : null}
          {!isLoadingFolders &&
            !isLoadingFiles &&
            folders !== undefined &&
            folders?.length > 0 &&
            folders.map((folder) => (
              <Folder
                key={folder.id}
                {...{ ...folder, parentFolderId: currentFolder.id }}
              />
            ))}
          {!isLoadingFolders &&
            !isLoadingFiles &&
            files !== undefined &&
            files?.length > 0 &&
            files.map((file) => <File key={file.fileId} {...file} />)}
          {!isLoadingFolders &&
          !isLoadingFiles &&
          folders?.length === 0 &&
          files?.length === 0 ? (
            <div className="h-full w-full flex flex-col justify-center items-center text-slate-100">
              hmmm... there doesn't seem to be anything here...
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default FolderId;

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

  const { folderId } = context.params;
  const parentFolder = await prisma.folder.findUnique({
    where: { id: folderId },
  });

  if (!parentFolder || parentFolder.userId !== user.id)
    return { notFound: true };
  console.log(user);

  return {
    props: {
      session,
      parentFolder: JSON.stringify(parentFolder),
      user,
    },
  };
};
