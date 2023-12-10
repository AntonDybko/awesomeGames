import { createContext, useState } from "react";

interface DialogContextProps {
    visible: boolean,
    setVisible: (visible: boolean) => void
}

const DialogContext = createContext<DialogContextProps>({
    visible: false,
    setVisible: () => {}
});

interface AuthProviderProps {
  children: React.ReactNode
}

export const DialogProvider: React.FC<AuthProviderProps> = ({
    children,
}) => {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <DialogContext.Provider value={{ visible, setVisible }}>
      {children}
    </DialogContext.Provider>
  );
};

export default DialogContext;