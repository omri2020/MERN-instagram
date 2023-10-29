function Icon({ src, height = 6, ...props }) {
  return (
    <img
      src={`/img/icons/${src}.png`}
      alt={src}
      className={`h-${height}`}
      {...props}
    />
  );
}

export default Icon;
