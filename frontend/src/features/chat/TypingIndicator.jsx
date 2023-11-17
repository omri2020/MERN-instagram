import React from "react";

const TypingIndicator = () => {
  return (
    <div className="flex w-fit items-center justify-center rounded-xl bg-gray-200 p-1.5 py-2">
      <div className="wrapper rounded-lg">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="shadow"></div>
        <div className="shadow"></div>
        <div className="shadow"></div>
      </div>
    </div>
  );
};

export default TypingIndicator;
