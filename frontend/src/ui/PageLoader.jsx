function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white">
      {/* You can add more styles and elements to create a full-page loader */}
      <div className="animation animate-slide bg-200 bg-gradient-animation fixed left-0 top-0 h-1.5 w-full"></div>
    </div>
  );
}

export default PageLoader;
