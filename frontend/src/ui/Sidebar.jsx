import NavMenu from "./NavMenu";

function Sidebar() {
  return (
    <div className="sticky top-0 flex h-[100vh] w-64 flex-col border-r px-4 py-8">
      <NavMenu />
    </div>
  );
}

export default Sidebar;
