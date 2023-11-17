import React from "react";
import IconNavMenu from "./IconNavMenu";

const IconSidebar = () => {
  return (
    <div className="sticky top-0 flex h-[100vh] flex-col items-center border-r px-2 py-8">
      <IconNavMenu />
    </div>
  );
};

export default IconSidebar;
