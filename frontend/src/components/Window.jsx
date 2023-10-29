import { twMerge } from "tailwind-merge";

function Window({ children, className, modalRef }) {
  const windowStyle = twMerge(
    "rounded-lg bg-white text-center shadow-xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all sm:my-8 sm:align-middle",
    className,
  );
  return (
    <div ref={modalRef} className={windowStyle}>
      {children}
    </div>
  );
}

export default Window;
