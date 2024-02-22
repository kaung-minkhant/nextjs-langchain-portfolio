import OpenAI from "openai";
import {
  ChatCompletionMessageParam,
  experimental_buildOpenAIMessages,
} from "ai/prompts";
import { LangChainStream, OpenAIStream, StreamingTextResponse } from "ai";
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

    // const openai = new OpenAI({
    //   apiKey: process.env.OPENAI_APIKEY,
    // });

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

    // const systemMessage: ChatCompletionMessageParam = {
    //   role: "system",
    //   content:
    //     "You are a sarcasm bot. You anser all user questions in a sarcastic way.",
    // };

    // const response = await openai.chat.completions.create({
    //   model: "gpt-3.5-turbo",
    //   stream: true,
    //   messages: [systemMessage, ...messages],
    // });

    // const stream = OpenAIStream(response);

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
