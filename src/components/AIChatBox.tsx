import { cn } from "@/lib/utils";
import { Message, useChat } from "ai/react";
import { Bot, SendHorizonal, Trash, XCircle } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import ChatMessage from "./ChatMessage";
import { useEffect, useRef } from "react";
interface AIChatBoxProps {
  open: boolean;
  onClose: () => void;
}
export default function AIChatBox({ open, onClose }: AIChatBoxProps) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    setMessages,
  } = useChat({
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content:
          "hi i am chat bot,hi i am chat bot,hi i am chat bot,hi i am chat bot,hi i am chat bot,hi i am chat bot,hi i am chat bot,hi i am chat bot,hi i am chat bot,hi i am chat bot,hi i am chat bot,hi i am chat bot,",
      },
      { id: "2", role: "user", content: "hi i am the user" },
      {
        id: "3",
        role: "user",
        content: `
- item 1
- item 2
- item 3
hi i am the user
hi i am the user
[hello](www.hello.com)
- item 1
- item 2
- item 3
      `,
      },
    ],
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (error) {
      setMessages([
        ...messages,
        {
          id: "error",
          role: "assistant",
          content: "Something went wrong. Please try again!😭",
        },
      ]);
    }
  }, [error]);

  const isLastMessageUser = messages[messages.length - 1]?.role === "user";
  return (
    <div
      className={cn(
        "bottom-0 right-0 z-50 w-full max-w-[500px] p-1 xl:right-36",
        open ? "fixed" : "hidden",
      )}
    >
      <div className="flex h-[600px] flex-col rounded border bg-background shadow-xl">
        <button onClick={onClose} className="me-3 ms-auto mt-3 block">
          <XCircle size={30} />
        </button>
        <div ref={scrollRef} className="mt-3 h-full overflow-y-auto px-3">
          {/* render chat messages */}
          {messages.map((message) => (
            <ChatMessage message={message} key={message.id} />
          ))}
          {/* ai is thinking  */}
          {isLoading && isLastMessageUser && (
            <ChatMessage
              message={{
                id: "loading",
                role: "assistant",
                content: "Thinking...",
              }}
            />
          )}
          {/* something went wrong */}
          {/* {error && (
            <ChatMessage
              message={{
                id: "error",
                role: "assistant",
                content: "Something went wrong. Please try again!😭",
              }}
            />
          )} */}
          {/* conversation not started yet */}
          { messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <Bot size={28} />
              <p className="text-lg font-medium">
                Send a message to start AI chat!
              </p>
              <p>
                You can ask the chatbot anything about me, it will find relevent
                information on <strong>this website</strong>
              </p>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="g-1 mx-3 mb-4 flex">
          <button
            type="button"
            className="flex w-10 flex-none items-center justify-center"
            title="clear chat"
            onClick={() => setMessages([])}
          >
            <Trash size={24} />
          </button>
          <input
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Say something..."
            className="flex-grow rounded border bg-background px-3 py-2"
          />
          <button
            type="submit"
            className="flex w-10 flex-none items-center justify-center disabled:opacity-50"
            disabled={isLoading || input.length === 0}
          >
            <SendHorizonal size={24} />
          </button>
        </form>
      </div>
    </div>
  );
}
