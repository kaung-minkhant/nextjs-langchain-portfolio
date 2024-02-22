import { LangChainStream, StreamingTextResponse } from "ai";
import { Ollama } from "@langchain/community/llms/ollama";
import { ChatPromptTemplate } from '@langchain/core/prompts'

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages;
    const currentMessageContent = messages[messages.length -1]?.content;

    const {stream, handlers} = LangChainStream()

    const ollama = new Ollama({
      baseUrl: "http://localhost:11434", // Default value
      model: "llama2", // Default value
      callbacks: [handlers] 
    });

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system", "You are a sarcasm bot. You anser all user questions in a sarcastic way."
      ],
      [
        'user', '{input}'
      ]
    ])

    const chain = prompt.pipe(ollama)

    chain.invoke({
      input: currentMessageContent
    })

    return new StreamingTextResponse(stream);

  } catch (error) {
    console.error(error);
    return Response.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
