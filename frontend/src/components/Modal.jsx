import { createContext, useContext, useState, cloneElement } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";

const ModalContext = createContext();

const Button = ({ children, opens, className }) => {
  const { toggleModal } = useContext(ModalContext);

  return (
    <button
      className={className}
      onClick={() => {
        toggleModal(opens);
      }}
    >
      {children}
    </button>
  );
};

const Window = ({ children, name, className }) => {
  const { modalStack, closeModal } = useContext(ModalContext);

  const windowStyle = twMerge(
    "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl",
    className,
  );

  const enhancedChildren = cloneElement(children, { closeModal });

  if (!modalStack?.includes(name)) return null;

  return createPortal(
    <div
      className="fixed left-0 top-0  h-screen w-screen bg-black bg-opacity-60"
      onClick={() => closeModal()}
    >
      <div className="fixed right-0 top-0">
        <button onClick={() => closeModal()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="35"
            height="35"
            fill="white"
            className="bi bi-x"
            viewBox="0 0 16 16"
          >
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />{" "}
          </svg>
        </button>
      </div>
      <div className={windowStyle} onClick={(e) => e.stopPropagation()}>
        {enhancedChildren}
      </div>
    </div>,
    document.body,
  );
};

const Modal = ({ children }) => {
  const [modalStack, setModalStack] = useState([]);

  const toggleModal = (name) => {
    if (modalStack.includes(name)) {
      setModalStack((stack) => stack.filter((m) => m !== name));
    } else {
      setModalStack((stack) => [...stack, name]);
    }
  };

  const pushModal = (name) => {
    setModalStack((stack) => [...stack, name]);
  };

  const popModal = () => {
    setModalStack((stack) => stack.slice(0, stack.length - 1));
  };

  return (
    <ModalContext.Provider
      value={{
        name: modalStack[modalStack.length - 1],
        toggleModal,
        closeModal: popModal,
        setModal: pushModal,
        modalStack,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

Modal.Button = Button;
Modal.Window = Window;
export default Modal;
