import ChatHistory from "./ChatHistory";
import MessageInput from "./MessageInput";
import Title from "./Title";

export default function Right() {
  return (
    <div className="flex flex-col justify-between flex-1 w-full h-full">
      <Title />
      <ChatHistory />
      <MessageInput />
    </div>
  );
}
