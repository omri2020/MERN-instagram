import { createContext, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useOutsideClick } from "../hooks/useOutsideClick";
import Icon from "../components/Icon";

const MenuContext = createContext();

const MenuButton = ({ src, text }) => {
  const { setOpenMenu, buttonRef } = useContext(MenuContext);
  return (
    <div
      ref={buttonRef}
      className="relative flex w-full cursor-pointer items-center rounded-md p-3 transition-all hover:bg-gray-100 [&_img]:hover:scale-110"
      onClick={() => setOpenMenu((prev) => !prev)}
    >
      <Icon src={src} height={6} />
      <div className="pl-4">{text}</div>
    </div>
  );
};

const MenuList = ({ children }) => {
  const { menuRef, buttonRef, openMenu } = useContext(MenuContext);

  useEffect(() => {
    if (buttonRef.current && menuRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      menuRef.current.style.width = `${rect.width}px`;
      menuRef.current.style.top = `${rect.top}px`;
      menuRef.current.style.left = `${rect.left}px`;
    }
  }, [buttonRef, menuRef, openMenu]);

  return openMenu
    ? createPortal(
        <div
          ref={menuRef}
          className="fixed -mt-1 -translate-y-full rounded-xl bg-white shadow-2xl"
        >
          {children}
        </div>,
        document.body,
      )
    : null;
};

function Menu({ children }) {
  const [openMenu, setOpenMenu] = useState(false);

  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useOutsideClick(menuRef, [buttonRef], () => setOpenMenu(false));

  return (
    <MenuContext.Provider value={{ openMenu, setOpenMenu, menuRef, buttonRef }}>
      {children}
    </MenuContext.Provider>
  );
}

Menu.Button = MenuButton;
Menu.List = MenuList;

export default Menu;
