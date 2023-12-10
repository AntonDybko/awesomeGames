import DialogContext from "context/DialogProvider";
import { useContext } from "react";

const useDialog = () => {
  return useContext(DialogContext);
};

export default useDialog;