import DeleteFile from "../DeleteFile/DeleteFile";
import Icon from "../Icon/Icon";
import DownloadFile from "../DownloadFile/DownloadFile";
import { File } from "../../types/types";

function File({
  id,
  fileId,
  name,
  type,
  size,
  downloadUrl,
  path,
  createdAt,
  folderId: parentFolderId,
}: File) {
  return (
    <div className="flex flex-row justify-between items-center mx-4 w-auto my-1 px-2 text-xs bg-slate-500 rounded">
      <div className="w-5/6 overflow-hidden p-1">
        <div className="text-4xl text-slate-200 hover:text-amber-400 flex flex-row items-center">
          <Icon type={type} />
          <h1 className="ml-2 text-slate-100 hover:text-amber-300">{name}</h1>
        </div>
        <div className="text-xs text-slate-50 mt-1">{size} bytes</div>
        <div className="text-xs text-slate-50 mt-1">
          {new Date(createdAt).toString()}
        </div>
      </div>
      <div className="w-1/6 flex flex-row justify-end items-center">
        <DeleteFile fileId={id} parentFolderId={parentFolderId} />
        <DownloadFile id={id} />
      </div>
    </div>
  );
}

export default File;
