import { useUploadPost } from "./useUploadPost";
import UploadPhotoForm from "./UploadPhotoForm";
import DiscardButton from "../../components/DiscardButton";
import CreatePostForm from "./CreatePostForm";

function CreatePostWindow({ closeModal, stepCount, setStepCount }) {
  const {
    uploadPhoto,
    deletePhoto,
    isLoading,
    error,
    currentPhoto,
    createPost,
  } = useUploadPost();

  return (
    <div className="flex h-full flex-col">
      <div
        className={`flex w-full items-center ${
          currentPhoto ? "justify-between" : "justify-center"
        } border-b px-4 py-3 font-semibold`}
      >
        {currentPhoto && (
          <DiscardButton
            deletePhoto={deletePhoto}
            currentPhoto={currentPhoto}
            stepCount={stepCount}
            setStepCount={setStepCount}
            closeModal={closeModal}
          />
        )}
        <h3>{currentPhoto ? "Crop" : "Create new post"}</h3>
        {currentPhoto && (
          <button
            className="text-sm text-sky-500"
            onClick={() => {
              if (stepCount < 1) {
                setStepCount((p) => p + 1);
              }
            }}
            form={stepCount > 0 ? "createPost" : undefined}
          >
            {stepCount < 1 ? "Next" : "Share"}
          </button>
        )}
      </div>
      <div className="flex h-full">
        <div className="flex h-full w-full flex-col items-center justify-center gap-4">
          <UploadPhotoForm
            uploadPhoto={uploadPhoto}
            isLoading={isLoading}
            error={error}
            currentPhoto={currentPhoto}
          />
        </div>
        {stepCount > 0 && <CreatePostForm createPost={createPost} />}
      </div>
    </div>
  );
}

export default CreatePostWindow;
