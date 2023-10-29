import { useEffect } from "react";

export function useOutsideClick(menuRef, ignoreRefs = [], callback) {
  useEffect(() => {
    function handleClickOutside(event) {
      const clickedInsideIgnoredElement = ignoreRefs.some(
        (ref) => ref.current && ref.current.contains(event.target),
      );
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !clickedInsideIgnoredElement
      ) {
        callback(event);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef, ignoreRefs, callback]);

  return menuRef;
}
