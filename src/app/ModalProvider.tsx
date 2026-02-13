import { createContext, useCallback, useContext, useState } from 'react';
import { CardType } from '../features/cards/card';

const ModalContext = createContext<{
    modalData: ModalData,
    setModal: (_a:ModalData, _b:(()=>void) | null) => void,
    closeModal: () => void,
}>({
    modalData: null,
    setModal: (_a, _b) => {},
    closeModal: () => {},
});

export const useModal = () => {
  return useContext(ModalContext);
};

const INSPECT = "inspect";
type ModalData = {
    type: typeof INSPECT,
    card: CardType,
} | null;

const ModalProvider = ({ children } : {children: React.ReactNode}) => {
  const [modalData, setModalData] = useState<ModalData>(null);
  const [closeModalFn, setCloseModalFn] = useState<(() => void) | null>(null);

  const setModal = useCallback((data : ModalData, closeFn : (() => void) | null) => {
    setModalData(data);
    setCloseModalFn(() => closeFn);
  }, []);

  const closeModal = useCallback(() => {
    if(closeModalFn) closeModalFn();
  }, [closeModalFn]);

  return (
    <ModalContext.Provider value={{ modalData, setModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};
export default ModalProvider;