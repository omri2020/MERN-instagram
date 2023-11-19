import Modal from "../components/Modal";
import Icon from "./Icon";

function DiscardButton({
  deletePhoto,
  currentPhoto,
  stepCount,
  dispatch,
  closeModal,
}) {
  return (
    <>
      {stepCount === 0 ? (
        <Modal.Button opens="discard">
          <Icon src="discard-icon.png" height={6} />
        </Modal.Button>
      ) : (
        <button onClick={() => dispatch({ type: "prevStep" })}>
          <Icon src="discard-icon.png" height={6} />
        </button>
      )}
      <Modal.Window name="discard" className="w-3/12">
        <div className="flex h-full flex-col">
          <div className="flex flex-col items-center gap-1  py-6">
            <span className="text-xl">Discard post?</span>
            <span className="text-sm text-gray-500">
              If you leave, your edits won't be saved.
            </span>
          </div>
          <div className="flex w-full flex-col text-sm [&>*]:w-full [&>*]:cursor-pointer [&>*]:border-t [&>*]:py-3">
            <span
              className="flex items-center justify-center font-bold text-red-500"
              onClick={(e) => {
                deletePhoto(currentPhoto);
                closeModal();
              }}
            >
              Discard
            </span>
            <span
              className="flex items-center justify-center"
              onClick={() => {
                closeModal();
              }}
            >
              Cancel
            </span>
          </div>
        </div>
      </Modal.Window>
    </>
  );
}

export default DiscardButton;
