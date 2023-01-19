import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../lib/axios";
import Modal from "../Modal/Modal";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { UpdateFolderProps, Folder, UpdateFolder } from "../../types/types";

const updateFolder: UpdateFolder = async ({ newFolderName, folderId }) => {
  return await axios.put<{ updatedFolder: Folder }>("/api/updateFolder", {
    newFolderName,
    folderId,
  });
};

function UpdateFolder({ folderId, parentFolderId }: UpdateFolderProps) {
  const { data: session, status } = useSession();

  const [openEditForm, setOpenEditForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const handleOpenEditForm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    setOpenEditForm(true);
  };

  const handleCloseEditForm = (
    e?: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    e?.preventDefault();
    if (isLoading) return; // prevent modal from closing when submitting to backend

    setNewFolderName("");
    setOpenEditForm(false);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNewFolderName(e.target.value);
  };

  const inputRef = useCallback((node: HTMLInputElement | null) => {
    if (!node) return;
    node.focus();
  }, []);

  const queryClient = useQueryClient();
  const { error, isError, isLoading, isSuccess, mutate } = useMutation(
    updateFolder,
    {
      onSuccess: (data) => {
        const {
          data: { updatedFolder },
        } = data;

        //queryClient.invalidateQueries(["usersFolders"]);

        queryClient.setQueryData(
          ["usersFolders", parentFolderId],
          (oldQueryData: any) => {
            if (!oldQueryData?.data?.folders) return oldQueryData;

            const updatedArrayOfFolders = oldQueryData.data.folders.map(
              (folder: Folder) => {
                if (folder.id === updatedFolder.id) return updatedFolder;
                return folder;
              }
            );

            return {
              ...oldQueryData,
              data: {
                ...oldQueryData.data,
                folders: [...updatedArrayOfFolders],
              },
            };
          }
        );
        setNewFolderName("");
        setOpenEditForm(false);
      },
    }
  );

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!newFolderName) return;
    if (!session?.user?.email) return;
    if (isLoading) return;

    mutate({ newFolderName, folderId });
  };

  return (
    <>
      <button
        onClick={handleOpenEditForm}
        className={`text-slate-50 bg-amber-400 py-2 px-3.5 rounded hover:bg-amber-500 mx-2`}
      >
        <FontAwesomeIcon icon={faPenToSquare} />
      </button>

      <Modal open={openEditForm} onClose={handleCloseEditForm}>
        <form className="p-1.5 bg-slate-400 rounded relative">
          <input
            type="input"
            id="newFolderName"
            name="newFolderName"
            value={newFolderName}
            onChange={handleInput}
            ref={inputRef}
            disabled={isLoading}
            className={`static bg-slate-200 text-4xl p-1 m-20 appearance-none border-2 border-slate-200 rounded text-slate-800 leading-tight focus:outline-none focus:bg-white focus:border-amber-400 ${
              isLoading &&
              `bg-slate-200 text-slate-300 focus:bg-slate-200 focus:border-amber-200`
            }`}
          />
          <button
            onClick={handleCloseEditForm}
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

export default UpdateFolder;
