import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

function Button({ className, type, children, ...props }) {
  const classes = twMerge(
    "mb-3 w-full rounded-lg bg-blue-500 p-2 text-sm font-semibold text-white block text-center",
    className,
  );

  if (props.to) {
    return (
      <Link to={props.to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}

export default Button;
