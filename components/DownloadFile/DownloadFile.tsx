import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleDown } from "@fortawesome/free-regular-svg-icons";
import axios from "../../lib/axios";
import { memo } from "react";
import { DownloadButtonProps } from "../../types/types";
import { useState } from "react";

const DownloadButton = ({ id }: DownloadButtonProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleDownloadButtonClick = async () => {
    try {
      if (isSubmitting) return;
      if (id === "" || id === null || id === undefined || !id) return;
      setIsSubmitting(true);
      const {
        data: { signedUrl },
      } = await axios.post<{ signedUrl: string }>("/api/viewFile", { id });

      if (signedUrl) window.open(signedUrl, "_blank");
      setIsSubmitting(false);
    } catch (err) {
      console.log(err);
      setIsSubmitting(false);
    }
  };
  return (
    <button
      onClick={handleDownloadButtonClick}
      disabled={isSubmitting}
      className={`text-slate-50 bg-amber-400 py-2 px-3.5 rounded hover:bg-amber-500 mx-2 ${
        isSubmitting && `bg-amber-200 text-slate-50 hover:bg-amber-200`
      }`}
    >
      <FontAwesomeIcon icon={faCircleDown} />
    </button>
  );
};

export default memo(DownloadButton);
