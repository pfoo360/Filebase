import { memo } from "react";
import Link from "next/link";
import DeleteFolder from "../DeleteFolder/DeleteFolder";
import UpdateFolder from "../UpdateFolder/UpdateFolder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderClosed } from "@fortawesome/free-regular-svg-icons";
import { Folder } from "../../types/types";

function Folder({ id, name, createdAt, userId, parentFolderId }: Folder) {
  return (
    <div className="flex flex-row justify-between items-center mx-4 w-auto my-1 px-2 text-xs bg-slate-500 rounded">
      <div className="w-5/6 overflow-hidden p-1">
        <Link
          href={`/f/${id}`}
          className="text-4xl text-slate-200 hover:text-amber-400 flex flex-row items-center"
        >
          <FontAwesomeIcon icon={faFolderClosed} className="mr-2" />
          <span className="text-slate-100 hover:text-amber-300">{name}</span>
        </Link>
        <div className="text-xs text-slate-50 mt-1">{createdAt}</div>
      </div>

      <div className="w-1/6 flex flex-row justify-end items-center">
        <DeleteFolder folderId={id} parentFolderId={parentFolderId} />
        <UpdateFolder folderId={id} parentFolderId={parentFolderId} />
      </div>
    </div>
  );
}

export default memo(Folder);
//export default Folder;
