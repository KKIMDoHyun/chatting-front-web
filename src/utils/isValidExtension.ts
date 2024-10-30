import { DefaultExtensionType, defaultStyles } from "react-file-icon";

export const isValidExtension = (
  extension: string | false
): extension is DefaultExtensionType => {
  return typeof extension === "string" && extension in defaultStyles;
};
