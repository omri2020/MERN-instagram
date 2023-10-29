import { BACKEND_URL } from "../utils/constants";

function BackendPhoto({ folder, filename, alt, className }) {
  return (
    <img
      src={`${BACKEND_URL}/public/img/${folder}/${filename}`}
      alt={alt}
      className={className}
    />
  );
}

export default BackendPhoto;
