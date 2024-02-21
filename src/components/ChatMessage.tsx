import { cn } from "@/lib/utils";
import { Bot } from "lucide-react";
import Link from "next/link";
import {Message} from 'ai'
import ReactMarkdown from "react-markdown";

interface ChatMessageProp {
  message: Message;
}
export default function ChatMessage({ message: { role, content } }: ChatMessageProp) {
  const isAIMessage = role === "assistant";
  return (
    <div
      className={cn(
        "mb-3 flex items-center",
        isAIMessage ? "me-5 justify-start" : "ms-5 justify-end",
      )}
    >
      {isAIMessage && <Bot className="me-3 flex-none" />}
      <div
        className={cn(
          "rounded border px-3 py-2",
          isAIMessage ? "bg-background" : "bg-foreground text-background",
        )}
      >
        <ReactMarkdown
          components={{
            a: ({ node, ref, ...props }) => (
              <Link
                href={props.href ?? ""}
                {...props}
                className="text-primary hover:underline"
              />
            ),
            p: ({ node, ref, ...props }) => (
              <p {...props} className="mt-3 first:mt-0" />
            ),
            ul: ({ node, ref, ...props }) => (
              <ul
                {...props}
                className="mt-3 list-inside list-disc first:mt-0"
              />
            ),
            li: ({ node, ref, ...props }) => <li {...props} className="mt-1" />,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}