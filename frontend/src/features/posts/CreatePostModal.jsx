import { useReducer } from "react";
import { usePhotoUpload } from "./hooks/usePhotoUpload";
import { usePhotoDelete } from "./hooks/usePhotoDelete";
import { useCreatePost } from "./hooks/useCreatePost";
import UploadPhotoForm from "./UploadPhotoForm";
import DiscardButton from "../../components/DiscardButton";
import CreatePostForm from "./CreatePostForm";
import BackendPhoto from "../../components/BackendPhoto";

const initialState = { stepCount: 0, currentPhoto: null };

function reducer(state, action) {
  switch (action.type) {
    case "nextStep":
      return { ...state, stepCount: state.stepCount + 1 };
    case "prevStep":
      return { ...state, stepCount: state.stepCount - 1 };
    case "setPhoto":
      return { ...state, currentPhoto: action.payload };
    case "reset":
      return initialState;
    default:
      throw new Error();
  }
}

function CreatePostModal({ closeModal }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { stepCount, currentPhoto } = state;

  const setCurrentPhoto = (photo) => {
    dispatch({ type: "setPhoto", payload: photo });
  };

  const { uploadPhoto, isUploading, errorUploading } =
    usePhotoUpload(setCurrentPhoto);
  const { deletePhoto, isDeleting, errorDeleting } =
    usePhotoDelete(setCurrentPhoto);
  const { createPost, isCreating, errorCreating } =
    useCreatePost(setCurrentPhoto);

  const isLoading = isUploading || isDeleting || isCreating;
  const error = errorUploading || errorDeleting || errorCreating;

  return (
    <div
      className={`${
        stepCount > 0 ? "w-[70rem]" : "w-[56rem]"
      } flex h-[56rem] flex-col overflow-hidden rounded-xl`}
    >
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
            dispatch={dispatch}
            closeModal={closeModal}
          />
        )}
        <h3>{currentPhoto ? "Crop" : "Create new post"}</h3>
        {currentPhoto && (
          <button
            className="text-sm text-sky-500"
            onClick={() => {
              stepCount === 0 && dispatch({ type: "nextStep" });
            }}
            form={stepCount > 0 ? "createPost" : undefined}
          >
            {stepCount < 1 ? "Next" : "Share"}
          </button>
        )}
      </div>
      <div className="flex h-full">
        {currentPhoto ? (
          <BackendPhoto
            folder="posts"
            filename={currentPhoto}
            className="h-full w-full object-cover"
          />
        ) : (
          <UploadPhotoForm
            uploadPhoto={uploadPhoto}
            isLoading={isLoading}
            error={error}
          />
        )}
        {stepCount > 0 && <CreatePostForm createPost={createPost} />}
      </div>
    </div>
  );
}

export default CreatePostModal;
