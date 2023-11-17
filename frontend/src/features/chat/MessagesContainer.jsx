import React from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../user/useUser";
import { useTyping } from "./hooks/useTyping";
import TypingIndicator from "./TypingIndicator";

const MessagesContainer = ({ messages }) => {
  const { user } = useUser();
  const { chatId } = useParams();
  const userId = user?._id;

  const { typingStatus } = useTyping();
  const isUserTyping = typingStatus ? typingStatus[chatId] : false;

  const divRef = React.useRef(null);

  React.useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollTop = divRef.current.scrollHeight;
    }
  }, [messages, isUserTyping]);

  return (
    <div ref={divRef} className="flex grow flex-col overflow-y-auto px-4">
      <div className="mb-auto"></div>
      {messages?.map((message) =>
        message.sender._id === userId ? (
          <div
            key={message._id}
            className="mb-0.5 self-end rounded-b-full rounded-l-full bg-sky-500 px-2 py-1.5 text-white"
          >
            {message.message}
          </div>
        ) : (
          <div
            key={message._id}
            className="mb-0.5 self-start rounded-b-full rounded-r-full bg-gray-200 px-2 py-1.5"
          >
            {message.message}
          </div>
        ),
      )}
      {isUserTyping && <TypingIndicator />}
    </div>
  );
};

export default MessagesContainer;
