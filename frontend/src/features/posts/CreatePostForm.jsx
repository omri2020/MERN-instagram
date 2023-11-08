import { useForm } from "react-hook-form";
import { useUser } from "../user/useUser";

import UserPhoto from "../../components/UserPhoto";

function CreatePostForm({ createPost }) {
  const { user } = useUser();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const text = watch("caption", "");
  const characterLimit = "2,200";
  const characterCount = text.length;

  const onSubmit = (data) => {
    createPost(data);
  };

  return (
    <div className="h-full w-2/5 border-l">
      <form
        id="createPost"
        className="flex flex-col"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col items-start gap-5 border-b p-4">
          <div className="flex gap-3">
            <UserPhoto src={user.photo} size="small" />
            <span className="font-semibold">{user.name}</span>
          </div>
          <textarea
            placeholder="Write a caption..."
            className="w-full resize-none pb-36 outline-none"
            {...register("caption", { required: true })}
          ></textarea>
          {errors.caption && (
            <span className="self-end text-xs text-red-500">
              This field is required
            </span>
          )}
          <span className="self-end text-xs text-gray-400">
            {characterCount}/{characterLimit}
          </span>
        </div>

        <input
          placeholder="Add location"
          className="border-b p-4"
          {...register("location")}
        />
      </form>
    </div>
  );
}

export default CreatePostForm;
