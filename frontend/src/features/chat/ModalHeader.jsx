import { RxCross1 } from "react-icons/rx";

const ModalHeader = ({ closeModal }) => (
  <div className="relative border-b py-3 text-center">
    <button className="absolute right-0 top-0 p-4" onClick={closeModal}>
      <RxCross1 />
    </button>
    <h3 className="font-bold">New message</h3>
  </div>
);

export default ModalHeader;
