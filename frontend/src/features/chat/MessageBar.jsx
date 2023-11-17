import React, { useEffect } from "react";
import { useSocket } from "../../contexts/SocketContext";
import { useSendMessage } from "./hooks/useSendMessage";
import Icon from "../../components/Icon";

const MessageBar = ({ chatId }) => {
  const { socket } = useSocket();
  const { message, setMessage, sendMessage } = useSendMessage();

  const typingTimeoutRef = React.useRef(null);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const onTyping = (e) => {
    setMessage(e.target.value);

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopped_typing", chatId);
    }, 3000);

    socket.emit("typing", chatId);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    socket.emit("stopped_typing", chatId);

    sendMessage(chatId, message);

    setMessage("");
  };

  return (
    <div className="h-16 p-4">
      <form
        className="flex h-fit w-full grow-0 items-center gap-2 rounded-2xl border border-black p-0.5"
        onSubmit={onSubmit}
      >
        <Icon src="smiley-icon.png" alt="smiley" className="h-7" />
        <input
          className="w-full text-sm outline-none"
          placeholder="Message..."
          value={message}
          onChange={onTyping}
        />
        {message && message.length > 0 && (
          <button className="pr-2 text-sm font-bold text-sky-500 transition-all">
            Send
          </button>
        )}
      </form>
    </div>
  );
};

export default MessageBar;
