import { twMerge } from "tailwind-merge";
import { BACKEND_URL } from "../utils/constants";

const sizes = {
  small: "h-8 w-8",
  mini: "h-4 w-4",
};

function UserPhoto({ size, src, isStory = false, className }) {
  const classes = twMerge(
    `rounded-full ${
      isStory && "bg-gradient-to-r from-purple-500 to-pink-500 p-[0.3rem]"
    }`,
    className,
  );
  return (
    <div className={classes}>
      <img
        src={`${BACKEND_URL}/public/img/users/${src}`}
        alt="user"
        className={`${
          size ? sizes[size] : "h-12"
        }  rounded-full object-cover ring-2 ring-transparent ring-offset-2`}
      />
    </div>
  );
}

export default UserPhoto;
