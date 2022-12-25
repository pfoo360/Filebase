import { useQuery } from "@tanstack/react-query";
import axios from "../lib/axios";
import { FetchFilesResponse, FetchFiles, UseFetchFiles } from "../types/types";

const fetchFiles: FetchFiles = async ({ parentFolderId, session }) => {
  const res = await axios.post<FetchFilesResponse>("/api/getFile", {
    parentFolderId,
    session,
  });
  return res;
};

const useFetchFiles: UseFetchFiles = ({ parentFolderId, session }) => {
  return useQuery(
    ["usersFiles", parentFolderId],
    () => fetchFiles({ parentFolderId, session }),
    {
      select: (res) => {
        return res.data.files;
      },
    }
  );
};

export default useFetchFiles;
