import { Message } from '../types';

interface ChatWindowProps {
  messages: Message[];
}

export function ChatWindow({ messages }: ChatWindowProps) {
  return (
    <div className="chat-window">
      {messages.length === 0 ? null : (
        messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            {message.text}
          </div>
        ))
      )}
    </div>
  );
}
