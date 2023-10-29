import { useCurrentUser } from "../features/user/useCurrentUser";
import useAuth from "../features/auth/useAuth";
import NavItem from "../components/NavItem";
import CreatePost from "./CreatePost";
import Logo from "../components/Logo";
import Menus from "./Menus";

function NavMenu() {
  const { logoutUser } = useAuth();
  const { data: user, isLoading } = useCurrentUser();

  return (
    <Menus>
      <div className="mb-auto flex flex-col gap-2">
        <Logo />
        <NavItem src="home-icon" text="Home" to="/" />
        <NavItem src="search-icon" text="Search" />
        <NavItem src="explore-icon" text="Explore" />
        <NavItem src="reels-icon" text="Reels" />
        <NavItem src="messenger-icon" text="Messages" />
        <NavItem src="heart-icon" text="Notifications" />
        <CreatePost />
        <NavItem photo={user?.photo} text="Profile" to={`/${user?.username}`} />
      </div>
      <div className="relative">
        <NavItem src="threads-icon" text="Threads" />
        <Menus.Button src="menu-icon" text="More" />
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
