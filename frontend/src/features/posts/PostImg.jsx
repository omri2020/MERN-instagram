import { BACKEND_URL } from "../../utils/constants";

function PostImg({ src }) {
  return (
    <img
      src={`${BACKEND_URL}/public/img/posts/${src}`}
      alt="post"
      className="h-[30rem] w-[28.5rem]"
    />
  );
}

export default PostImg;
