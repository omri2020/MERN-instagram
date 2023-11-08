import { createContext, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { twMerge } from "tailwind-merge";
import Icon from "./Icon";

const MenuContext = createContext();

const MenuButton = ({ src, text, iconStyles, className }) => {
  const { setOpenMenu, buttonRef } = useContext(MenuContext);
  const buttonStyles = twMerge(
    "relative flex w-full cursor-pointer items-center rounded-md p-3 transition-all",
    className,
  );
  return (
    <div
      ref={buttonRef}
      className={buttonStyles}
      onClick={() => setOpenMenu((prev) => !prev)}
    >
      <Icon src={src} className={iconStyles} />
      {text && <div className="pl-4">{text}</div>}
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
