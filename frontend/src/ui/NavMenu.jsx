import { useUser } from "../features/user/useUser";
import { useLogout } from "../features/auth/useLogout";
import NavItem from "../components/NavItem";
import CreatePost from "./CreatePost";
import Logo from "../components/Logo";
import Menus from "../components/Menus";

function NavMenu() {
  const { logoutUser } = useLogout();
  const { user } = useUser();

  return (
    <Menus>
      <div className="mb-auto flex flex-col gap-2">
        <Logo />
        <NavItem src="home-icon.png" text="Home" to="/" />
        <NavItem src="search-icon.png" text="Search" />
        <NavItem src="explore-icon.png" text="Explore" />
        <NavItem src="reels-icon.png" text="Reels" />
        <NavItem src="messenger-icon.png" text="Messages" />
        <NavItem src="heart-icon.png" text="Notifications" />
        <CreatePost />
        <NavItem photo={user?.photo} text="Profile" to={`/${user?.username}`} />
      </div>
      <div className="relative">
        <NavItem src="threads-icon.png" text="Threads" />
        <Menus.Button
          src="menu-icon.png"
          iconStyles="h-6"
          text="More"
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

export default NavMenu;
