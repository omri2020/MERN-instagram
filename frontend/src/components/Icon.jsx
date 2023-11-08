import { twMerge } from "tailwind-merge";

function Icon({ src, height = 6, ...props }) {
  const className = twMerge("h-6", props.className);

  return (
    <img src={`/img/icons/${src}`} alt={src} className={className} {...props} />
  );
}

export default Icon;
