import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileImage,
  faFileAudio,
  faFileText,
  faFilePdf,
  faFileVideo,
  faFileWord,
  faFileCode,
  faFilePowerpoint,
  faFileExcel,
  faFileArchive,
  faFileZipper,
  faFile,
} from "@fortawesome/free-regular-svg-icons";
import { IconProps } from "../../types/types";

function Icon({ type }: IconProps) {
  if (
    type.includes("wordprocessing") ||
    type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return <FontAwesomeIcon icon={faFileWord} />;

  if (
    type.includes("spreadsheet") ||
    type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  )
    return <FontAwesomeIcon icon={faFileExcel} />;

  if (
    type.includes("presentation") ||
    type ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  )
    return <FontAwesomeIcon icon={faFilePowerpoint} />;

  if (type === "application/pdf") return <FontAwesomeIcon icon={faFilePdf} />;

  if (type.includes("image")) return <FontAwesomeIcon icon={faFileImage} />;

  if (type.includes("audio")) return <FontAwesomeIcon icon={faFileAudio} />;

  if (type.includes("video")) return <FontAwesomeIcon icon={faFileVideo} />;

  if (type.includes("zip") || type.includes("compressed"))
    return <FontAwesomeIcon icon={faFileArchive} />;

  if (
    type.includes("javascript") ||
    type.includes("css") ||
    type.includes("html")
  )
    return <FontAwesomeIcon icon={faFileCode} />;

  if (type.includes("text")) return <FontAwesomeIcon icon={faFileText} />;

  return <FontAwesomeIcon icon={faFile} />;
}

export default Icon;
