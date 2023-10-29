import { twMerge } from "tailwind-merge";

function Button({ className, type, children, ...props }) {
  const classes = twMerge(
    "mb-3 w-full rounded-lg bg-blue-500 p-2 text-sm font-semibold text-white",
    className,
  );
  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}

export default Button;
