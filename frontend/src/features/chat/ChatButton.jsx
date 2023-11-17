import Button from "../../components/Button";

const ChatButton = ({ selected, handleChat }) => (
  <div className="px-4">
    <Button
      className={`bg-sky-400 ${selected.length === 0 && "bg-opacity-50"}`}
      onClick={handleChat}
    >
      Chat
    </Button>
  </div>
);

export default ChatButton;
