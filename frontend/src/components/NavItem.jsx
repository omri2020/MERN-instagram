import { Link } from "react-router-dom";
import Icon from "./Icon";
import { BACKEND_URL } from "../utils/constants";

function NavItem({ src, text, photo, ...props }) {
  return (
    <Link
      className="flex w-full cursor-pointer items-center rounded-md p-3 text-base transition-all hover:bg-gray-100 [&_img]:hover:scale-110"
      {...props}
    >
      {photo ? (
        <img
          src={`${BACKEND_URL}/public/img/users/${photo}`}
          alt="user"
          className="h-8 w-8 rounded-full object-cover"
        />
      ) : (
        <Icon src={src} />
      )}
      <span className="pl-4">{text}</span>
    </Link>
  );
}

export default NavItem;
