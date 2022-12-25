import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "../../lib/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faCircleXmark,
  faCircleCheck,
} from "@fortawesome/free-regular-svg-icons";
import { DeleteFolderProps, DeleteFolderFn, Folder } from "../../types/types";

const deleteFolder: DeleteFolderFn = async (folderId) => {
  return await axios.delete<{ deletedFolder: Folder }>("/api/deleteFolder", {
    data: folderId,
  });
};

function DeleteFolder({ folderId, parentFolderId }: DeleteFolderProps) {
  const [openConfirmationDialogBox, setOpenConfirmationDialogBox] =
    useState(false);

  const handleOpenConfirmationDialogBox = () => {
    setOpenConfirmationDialogBox(true);
  };

  const handleCloseConfirmationDialogBox = () => {
    setOpenConfirmationDialogBox(false);
  };

  const queryClient = useQueryClient();
  const { error, isError, isLoading, isSuccess, mutate } = useMutation(
    deleteFolder,
    {
      onSuccess: (data) => {
        const {
          data: { deletedFolder },
        } = data;
        //console.log(deletedFolder);

        queryClient.invalidateQueries(["usersFolders"]);
        queryClient.invalidateQueries(["usersFiles"]);

        // queryClient.setQueryData(
        //   ["usersFolders", parentFolderId],
        //   (oldQueryData) => {
        //     const updatedArrayOfFolders = oldQueryData.data.folders.filter(
        //       (folder) => folder.id !== deletedFolder.id
        //     );

        //     return {
        //       ...oldQueryData,
        //       data: { ...oldQueryData.data, folders: [...updatedArrayOfFolders] },
        //     };
        //   }
        // );
      },
    }
  );

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    if (
      folderId === null ||
      folderId === undefined ||
      folderId === "" ||
      !folderId
    )
      return;

    if (isLoading) return;

    //submit to backend api
    mutate(folderId);
  };

  return (
    <>
      {!openConfirmationDialogBox && (
        <button
          onClick={handleOpenConfirmationDialogBox}
          disabled={isLoading || isSuccess}
          className={`text-slate-50 bg-red-400 py-2 px-3.5 rounded hover:bg-red-500 mx-2 ${
            (isLoading || isSuccess) && `bg-red-200 hover:bg-red-200`
          }`}
        >
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
      )}
      {openConfirmationDialogBox && (
        <>
          <button
            onClick={handleDelete}
            disabled={isLoading || isSuccess}
            className={`text-slate-50 bg-red-400 py-2 px-3.5 rounded mx-2 hover:bg-red-500 ${
              (isLoading || isSuccess) && `bg-red-200 hover:bg-red-200`
            }`}
          >
            <FontAwesomeIcon icon={faCircleCheck} />
          </button>
          <button
            onClick={handleCloseConfirmationDialogBox}
            disabled={isLoading || isSuccess}
            className={`text-slate-50 bg-emerald-400 py-2 px-3.5 rounded mx-2 hover:bg-emerald-600 ${
              (isLoading || isSuccess) && `bg-green-200 hover:bg-green-200`
            }`}
          >
            <FontAwesomeIcon icon={faCircleXmark} />
          </button>
        </>
      )}
    </>
  );
}

// export default memo(DeleteFolder);
export default DeleteFolder;
