import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { Session } from "next-auth";
import { UseQueryResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { ReactPortal } from "react";

export type FolderId = string;
export type FileId = string;
export type UserId = string;
export type ParentFolderId = null | FolderId;

export interface Error {
  name?: string;
  message: string;
}

export interface Folder {
  id: FolderId;
  name: string;
  createdAt: Date;
  userId: string;
  parentFolderId: ParentFolderId;
  path: FolderId[];
}

export interface File {
  id: string;
  fileId: FileId;
  name: string;
  type: string;
  size: number;
  downloadUrl: string;
  createdAt: Date;
  path: string[];
  folderId: FolderId;
  userId: UserId;
}

export interface User {
  id: UserId;
  name?: string;
  email?: string;
  emailVerified?: Date;
  image?: string;
}

type AuthProvider = "github";

export interface Provider {
  provider: AuthProvider;
  name: string;
  icon: IconDefinition;
}

export type HandleOAuthSignIn = (provider: AuthProvider) => () => void;

export interface HomeProps {
  parentFolderId: ParentFolderId;
}

export interface FolderIdProps {
  user: User;
  parentFolder: string;
}

export interface UseFetchFoldersParams {
  parentFolderId: ParentFolderId;
  session: Session | null;
}

export type UseFetchFolders = (
  params: UseFetchFoldersParams
) => UseQueryResult<Folder[], unknown>;

export interface FetchFoldersResponse {
  folders: Folder[];
}

export interface FetchFoldersParams {
  parentFolderId: ParentFolderId;
  session: Session | null;
}

export type FetchFolders = (
  params: FetchFoldersParams
) => Promise<AxiosResponse<FetchFoldersResponse, any>>;

export interface FetchFilesResponse {
  files: File[];
}

export interface FetchFilesParams {
  parentFolderId: ParentFolderId;
  session: Session | null;
}

export type FetchFiles = (
  params: FetchFilesParams
) => Promise<AxiosResponse<FetchFilesResponse, any>>;

export interface UseFetchFilesParams {
  parentFolderId: ParentFolderId;
  session: Session | null;
}

export type UseFetchFiles = (
  params: UseFetchFilesParams
) => UseQueryResult<File[], unknown>;

export interface ModalProps {
  open: boolean;
  onClose: (
    e?:
      | React.MouseEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
  children: React.ReactNode | string;
}

export type ModalReturn = ReactPortal | null;

export interface AddFileProps {
  currentFolder: Folder;
  currentUser: User;
  path: string[];
}

export interface FileState {
  fileId: string;
  name: string;
  size: number;
  uploadedBytes: number;
}

export interface FileInformation {
  fileId: string;
  name: string;
  type: string;
  size: number;
  parentFolderId: FolderId;
  userId: UserId;
  path: string[];
  downloadUrl: string;
}

export type AddFile = (
  fileInformation: FileInformation
) => Promise<AxiosResponse<{ file: File }, any>>;

export interface AddFolderProps {
  parentFolderId: ParentFolderId;
  path: string[];
}

export interface AddFolderParams {
  folderName: string;
  parentFolderId: ParentFolderId;
  path: string[];
}
export type AddFolder = (
  params: AddFolderParams
) => Promise<AxiosResponse<{ folder: Folder }, any>>;

export interface DeleteFileProps {
  fileId: FileId;
  parentFolderId: FolderId;
}

export type DeleteFileFn = (params: {
  fileId: FileId;
}) => Promise<AxiosResponse<{ deletedFile: File }, any>>;

export interface DeleteFolderProps {
  folderId: FolderId;
  parentFolderId: ParentFolderId;
}

export type DeleteFolderFn = (
  folderId: FolderId
) => Promise<AxiosResponse<{ deletedFolder: Folder }, any>>;

export interface DownloadButtonProps {
  id: FileId;
}

export interface IconProps {
  type: string;
}

export interface SignOutButtonProps {
  children: string | React.ReactNode;
}

export interface UpdateFolderProps {
  folderId: FolderId;
  parentFolderId: ParentFolderId;
}

export interface UpdateFolderParams {
  newFolderName: string;
  folderId: FolderId;
}

export type UpdateFolder = (params: UpdateFolderParams) => Promise<
  AxiosResponse<
    {
      updatedFolder: Folder;
    },
    any
  >
>;
