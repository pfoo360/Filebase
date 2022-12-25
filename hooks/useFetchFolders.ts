import { useQuery } from "@tanstack/react-query";
import axios from "../lib/axios";
import {
  FetchFoldersResponse,
  UseFetchFolders,
  FetchFolders,
} from "../types/types";

const fetchFolders: FetchFolders = async ({ parentFolderId, session }) => {
  const res = await axios.post<FetchFoldersResponse>("/api/getFolder", {
    parentFolderId,
    session,
  });
  return res;
};

const useFetchFolders: UseFetchFolders = ({ parentFolderId, session }) => {
  return useQuery(
    ["usersFolders", parentFolderId],
    () => fetchFolders({ parentFolderId, session }),
    {
      select: (res) => {
        return res.data.folders;
      },
    }
  );
};

export default useFetchFolders;
