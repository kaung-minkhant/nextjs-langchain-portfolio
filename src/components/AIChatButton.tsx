"use client";

import { Bot } from "lucide-react";
import { useState } from "react";
import AIChatBox from "./AIChatBox";

export default function AIChatButton() {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  return (
    <>
      <button onClick={() => setIsChatOpen(true)}>
        <Bot size={24}  />
      </button>
      <AIChatBox open={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
