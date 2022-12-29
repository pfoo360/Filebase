import { storage } from "../../lib/firebase";
import { useState } from "react";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import Modal from "../Modal/Modal";
import { useSession } from "next-auth/react";
import axios from "../../lib/axios";
import { useMutation, useQueryClient, Updater } from "@tanstack/react-query";
import {
  AddFileProps,
  FileInformation,
  FileState,
  File,
  AddFile,
} from "../../types/types";
import { AxiosError, AxiosResponse } from "axios";

const addFile: AddFile = async (fileInformation) => {
  return await axios.post<{ file: File }>("/api/addFile", {
    ...fileInformation,
  });
};

function AddFile({ currentFolder, currentUser, path }: AddFileProps) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [files, setFiles] = useState<FileState[]>([] as FileState[]);
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();
  const { error, isError, isLoading, isSuccess, mutate } = useMutation(
    addFile,
    {
      onError: async (error: AxiosError) => {
        //file information could not be saved to DB; delete file in Firebase
        if (error?.config?.data) {
          const fileInformation = JSON.parse(error.config.data);

          if (fileInformation?.fileId && fileInformation?.name) {
            const FOLDER_PATH =
              currentFolder.path.length > 0
                ? `${currentFolder.path.join("/")}/${currentFolder.id}`
                : `${currentFolder.id}`;

            const FILE_PATH = `images/${currentUser.id}/${FOLDER_PATH}/${fileInformation.fileId}/${fileInformation.name}`;

            const storageRef = ref(storage, FILE_PATH);
            const a = await deleteObject(storageRef);
          }
        }
      },
      onSuccess: (data) => {
        const {
          data: { file },
        } = data;

        // queryClient.invalidateQueries(["usersFolders"]);

        queryClient.setQueryData(
          ["usersFiles", currentFolder.id],
          (oldQueryData: any) => {
            console.log(oldQueryData);
            return {
              ...oldQueryData,
              data: {
                ...oldQueryData.data,
                files: [...oldQueryData.data.files, file],
              },
            };
          }
        );
      },
    }
  );

  const handleModalOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    setModalIsOpen(true);
  };

  const handleModalClose = (
    e?: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    e?.preventDefault();
    if (isSubmitting) return;
    setModalIsOpen(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!session || !session?.user?.email) return;
    if (isSubmitting) return;
    if (
      !currentFolder?.userId ||
      !currentUser?.id ||
      currentFolder?.userId !== currentUser?.id
    )
      return; //if the currentUser is not the owner of folder

    const { files } = e.target;
    if (files === null || files.length <= 0) return;

    setIsSubmitting(true);
    let promises: Promise<FileInformation>[] = [];

    [...files].forEach((file, index) => {
      const fileInformation: Omit<FileInformation, "downloadUrl"> = {
        name: file.name,
        size: file.size,
        type: file.type,
        fileId: uuidv4(),
        parentFolderId: currentFolder.id,
        userId: currentUser.id,
        path,
      };

      setFiles((prev) => [
        ...prev,
        {
          fileId: fileInformation.fileId,
          name: fileInformation.name,
          size: fileInformation.size,
          uploadedBytes: 0,
        },
      ]);

      const FOLDER_PATH =
        currentFolder.path.length > 0
          ? `${currentFolder.path.join("/")}/${currentFolder.id}`
          : `${currentFolder.id}`;

      const storageRef = ref(
        storage,
        `images/${currentUser.id}/${FOLDER_PATH}/${fileInformation.fileId}/${fileInformation.name}`
      );

      const uploadTask = uploadBytesResumable(storageRef, file);
      const promise = new Promise<FileInformation>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            setFiles((prevProgress) => {
              let temp = [...prevProgress];
              temp[index] = {
                ...temp[index],
                uploadedBytes: snapshot.bytesTransferred,
              };
              return [...temp];
            });
          },
          (error) => {
            console.log(error);
            reject(error);
          },
          async () => {
            try {
              const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
              const payload: FileInformation = {
                ...fileInformation,
                downloadUrl,
              };
              mutate(payload);
              resolve(payload);
            } catch (error) {
              // file info could not be saved to DB; delete file in Firebase
              console.log(error);
              reject(error);
            }
          }
        );
      });
      promises.push(promise);
    });
    Promise.allSettled(promises).then((x) => {
      e.target.value = ""; //clear the input
      setFiles([]); // clear the list of uploading files displayed in UI
      promises = []; // reset promises array?
      setIsSubmitting(false); //know the pictures were UL'd to Firebase and corresponding fileInfo saved to DB
      //alert("done");
    });
  };
  return (
    <>
      <button
        onClick={handleModalOpen}
        className={`flex-shrink-0 bg-amber-400 hover:bg-amber-500 text-xl text-slate-100 py-1 px-2 rounded`}
      >
        Add File
      </button>
      <Modal open={modalIsOpen} onClose={handleModalClose}>
        <form className="flex flex-col p-1.5 h-96 w-[28rem] bg-slate-400 rounded relative">
          <input
            type="file"
            multiple
            id="files"
            name="files"
            onChange={handleFileSelect}
            disabled={isSubmitting}
            className={`static cursor-pointer mx-1.5 w-auto h-16 mt-2 mb-1 text-2xl text-slate-800 focus:outline-none hover:text-slate-600 file:mr-5 file:py-3 file:px-10 file:rounded-full file:border-none file:text-2xl file:text-slate-100 file:bg-slate-800 hover:file:cursor-pointer hover:file:bg-slate-700 ${
              isSubmitting &&
              `text-slate-300 hover:text-slate-300 file:text-slate-50 hover:file:text-slate-50 file:bg-slate-300 hover:file:bg-slate-300`
            }`}
          />
          {(!isSubmitting || files?.length === 0) && (
            <button
              onClick={handleModalClose}
              disabled={isSubmitting}
              className={`absolute bottom-4 right-4 flex-shrink-0 bg-slate-300 hover:bg-slate-500 text-xl text-slate-100 py-1 px-2 rounded ${
                isSubmitting && `bg-slate-100 text-slate-50 hover:bg-slate-100`
              }`}
            >
              Close
            </button>
          )}
          {isSubmitting || files?.length > 0 ? (
            <div className={`flex-1 mx-1.5 overflow-auto text-slate-50`}>
              {files.map(({ fileId, name, uploadedBytes, size }) => (
                <div key={fileId} className="flex flex-row justify-between">
                  <div className="w-2/3 overflow-hidden mr-5">{name}</div>
                  <div className="shrink-0 w-1/3 overflow-visible">{`${uploadedBytes} / ${size}`}</div>
                </div>
              ))}
            </div>
          ) : null}
        </form>
      </Modal>
    </>
  );
}

export default AddFile;
