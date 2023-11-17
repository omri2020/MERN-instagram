import { Link, useLocation } from "react-router-dom";
import { useNotification } from "../contexts/NotificationContext";
import Icon from "./Icon";
import { BACKEND_URL } from "../utils/constants";

function NavItem({ src, text, photo, hasNotifications, ...props }) {
  const { pathname } = useLocation();
  const isDirectInbox = pathname.includes("/direct/inbox");
  const { notifications } = useNotification();

  const totalNotifications = Object.values(notifications).reduce(
    (total, num) => total + num,
    0,
  );

  return (
    <Link
      className={`flex w-full cursor-pointer items-center ${
        isDirectInbox && "justify-center"
      } rounded-md p-3 text-base transition-all hover:bg-gray-100 [&_img]:hover:scale-110`}
      {...props}
    >
      {photo ? (
        <img
          src={`${BACKEND_URL}/public/img/users/${photo}`}
          alt="user"
          className="h-8 w-8 rounded-full object-cover"
        />
      ) : hasNotifications && totalNotifications > 0 ? (
        <div className="relative">
          <div className="absolute -right-2 -top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-red-500 text-xs text-white">
            <span>{totalNotifications}</span>
          </div>
          <Icon src={src} />
        </div>
      ) : (
        <Icon src={src} />
      )}
      {text && <span className="pl-4">{text}</span>}
    </Link>
  );
}

export default NavItem;
