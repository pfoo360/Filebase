import { useState, memo } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "../../lib/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faCircleXmark,
  faCircleCheck,
} from "@fortawesome/free-regular-svg-icons";
import { DeleteFileProps, DeleteFileFn, File } from "../../types/types";

const deleteFile: DeleteFileFn = async ({ fileId }) => {
  return await axios.delete<{ deletedFile: File }>("/api/deleteFile", {
    data: fileId,
  });
};

function DeleteFile({ fileId, parentFolderId }: DeleteFileProps) {
  const [openConfirmationDialogBox, setOpenConfirmationDialogBox] =
    useState(false);

  const queryClient = useQueryClient();
  const { error, isError, isLoading, isSuccess, mutate } = useMutation(
    deleteFile,
    {
      onSuccess: (data) => {
        const { deletedFile } = data.data;
        queryClient.setQueryData(
          ["usersFiles", parentFolderId],
          (oldQueryData) => {
            const updatedArrayOfFiles = oldQueryData.data.files.filter(
              (file) => file.id !== deletedFile.id
            );
            return {
              ...oldQueryData,
              data: { ...oldQueryData.data, files: updatedArrayOfFiles },
            };
          }
        );
      },
    }
  );

  const handleOpenConfirmationDialogBox = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e?.preventDefault();
    setOpenConfirmationDialogBox(true);
  };

  const handleCloseConfirmationDialogBox = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e?.preventDefault();
    setOpenConfirmationDialogBox(false);
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();

    if (fileId === null || fileId === undefined || fileId === "" || !fileId)
      return;

    if (isLoading) return;
    mutate({ fileId });
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

export default memo(DeleteFile);
