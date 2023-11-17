import { useUser } from "../features/user/useUser";
import { useLogout } from "../features/auth/useLogout";
import NavItem from "../components/NavItem";
import CreatePost from "./CreatePost";
import Menus from "../components/Menus";
import IconLogo from "../components/IconLogo";

function IconNavMenu() {
  const { logoutUser } = useLogout();
  const { user } = useUser();

  return (
    <Menus>
      <div className="mb-auto flex flex-col items-center justify-center gap-2">
        <IconLogo />
        <NavItem src="home-icon.png" to="/" />
        <NavItem src="search-icon.png" />
        <NavItem src="explore-icon.png" />
        <NavItem src="reels-icon.png" />
        <NavItem
          src="messenger-icon.png"
          to="/direct/inbox"
          hasNotifications={true}
        />
        <NavItem src="heart-icon.png" />
        <CreatePost />
        <NavItem photo={user?.photo} to={`/${user?.username}`} />
      </div>
      <div className="relative">
        <NavItem src="threads-icon.png" />
        <Menus.Button
          src="menu-icon.png"
          iconStyles="h-6"
          className="hover:bg-gray-100 [&_img]:hover:scale-110"
        />
        <Menus.List>
          <div className="absolute bottom-1 left-0 w-full rounded-xl bg-white shadow-2xl">
            <div className="flex flex-col items-start p-2 [&>*]:w-full [&>*]:cursor-pointer [&>*]:rounded-md [&>*]:p-4">
              <div className="hover:bg-gray-100">Settings</div>
              <div className="hover:bg-gray-100">Your activity</div>
              <div className="hover:bg-gray-100">Saved</div>
              <div className="hover:bg-gray-100">Switch appearance</div>
              <div className="hover:bg-gray-100">Report a problem</div>
              <div className="hover:bg-gray-100">Switch accounts</div>
              <div
                className="hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  logoutUser();
                }}
              >
                Log out
              </div>
            </div>
          </div>
        </Menus.List>
      </div>
    </Menus>
  );
}

export default IconNavMenu;
