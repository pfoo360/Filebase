import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleDown } from "@fortawesome/free-regular-svg-icons";
import axios from "../../lib/axios";
import { memo } from "react";
import { DownloadButtonProps } from "../../types/types";

const DownloadButton = ({ id }: DownloadButtonProps) => {
  const handleDownloadButtonClick = async () => {
    if (id === "" || id === null || id === undefined || !id) return;
    const {
      data: { signedUrl },
    } = await axios.post<{ signedUrl: string }>("/api/viewFile", { id });

    if (signedUrl) window.open(signedUrl, "_blank");
  };
  return (
    <button
      onClick={handleDownloadButtonClick}
      className={`text-slate-50 bg-amber-400 py-2 px-3.5 rounded hover:bg-amber-500 mx-2`}
    >
      <FontAwesomeIcon icon={faCircleDown} />
    </button>
  );
};

export default memo(DownloadButton);
