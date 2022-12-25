import { useState, useCallback } from "react";
import Modal from "../Modal/Modal";
import { useSession } from "next-auth/react";
import axios from "../../lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddFolderProps, AddFolder, Folder } from "../../types/types";

const addFolder: AddFolder = async ({ folderName, parentFolderId, path }) => {
  return await axios.post<{ folder: Folder }>("/api/addFolder", {
    folderName,
    parentFolderId,
    path,
  });
};

function AddFolder({ parentFolderId, path }: AddFolderProps) {
  const { data: session, status } = useSession();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [folderName, setFolderName] = useState("");

  const queryClient = useQueryClient();
  const { error, isError, isLoading, isSuccess, mutate } = useMutation(
    addFolder,
    {
      onSuccess: (data) => {
        const {
          data: { folder },
        } = data;

        // queryClient.invalidateQueries(["usersFolders"]);

        queryClient.setQueryData(
          ["usersFolders", parentFolderId],
          (oldQueryData) => {
            return {
              ...oldQueryData,
              data: {
                ...oldQueryData.data,
                folders: [...oldQueryData.data.folders, folder],
              },
            };
          }
        );

        setFolderName("");
        setModalIsOpen(false);
      },
    }
  );

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setFolderName(e.target.value);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!folderName) return;
    if (!session?.user?.email) return;
    if (isLoading) return;

    //submit to backend api
    const a = mutate({ folderName, parentFolderId, path });
    //setFolderName("");
    //setModalIsOpen(false);
  };

  const handleModalOpen = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    setModalIsOpen(true);
  };

  const handleModalClose = (
    e?: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    e?.preventDefault();
    if (isLoading) return; // prevent modal from closing when submitting to backend
    setFolderName("");
    setModalIsOpen(false);
  };

  const inputRef = useCallback((node: HTMLInputElement | null) => {
    if (!node) return;
    node.focus();
  }, []);

  return (
    <>
      <button
        onClick={handleModalOpen}
        className={`flex-shrink-0 bg-amber-400 hover:bg-amber-500 text-xl text-slate-100 py-1 px-2 rounded`}
      >
        Add Folder
      </button>
      <Modal open={modalIsOpen} onClose={handleModalClose}>
        <form className="p-1.5 bg-slate-400 rounded relative">
          <input
            type="text"
            id="name"
            name="name"
            value={folderName}
            onChange={handleInput}
            ref={inputRef}
            disabled={isLoading}
            className={`static bg-slate-200 text-4xl p-1 m-20 appearance-none border-2 border-slate-200 rounded text-slate-800 leading-tight focus:outline-none focus:bg-white focus:border-amber-400 ${
              isLoading &&
              `bg-slate-200 text-slate-300 focus:bg-slate-200 focus:border-amber-200`
            }`}
          />
          <button
            onClick={handleModalClose}
            disabled={isLoading}
            className={`absolute bottom-4 right-28 flex-shrink-0 bg-slate-300 hover:bg-slate-500 text-xl text-slate-100 py-1 px-2 rounded ${
              isLoading && `bg-slate-100 text-slate-50 hover:bg-slate-100`
            }`}
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`absolute bottom-4 right-5 flex-shrink-0 bg-amber-400 hover:bg-amber-500 text-xl text-slate-100 py-1 px-2 rounded ${
              isLoading && `bg-amber-200 text-slate-50 hover:bg-amber-200`
            }`}
          >
            Submit
          </button>
        </form>
      </Modal>
    </>
  );
}

export default AddFolder;
