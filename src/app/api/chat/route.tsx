import { LangChainStream, StreamingTextResponse } from "ai";
import { Ollama } from "@langchain/community/llms/ollama";
import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents'
import { createRetrievalChain } from 'langchain/chains/retrieval'
import { getVectoreStore } from "@/lib/chromadb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages;
    const currentMessageContent = messages[messages.length - 1]?.content;

    const { stream, handlers } = LangChainStream();

    const ollama = new Ollama({
      baseUrl: "http://localhost:11434", // Default value
      model: "llama2", // Default value
      callbacks: [handlers],
      verbose: true,
    });

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are a chatbot for a personal portfolio website. You impersonate the website's owner." + 
        "Answer the user's questions based on the below context." + 
        "Whenever it makes sense, provide links to pages that contain more information about the topic from the given context" +
        "Format your messages in markdown format. \n\n" +
        "Context:\n{context}",
      ],
      ["user", "{input}"],
    ]);

    const combinedDocsChain = await createStuffDocumentsChain({
      llm: ollama,
      prompt,
      documentPrompt: PromptTemplate.fromTemplate(
        "Page URL:{url}\n\nPage content: {page_content}"
      ),
      documentSeparator: "\n--------------\n"
    })

    const retrievel = ( await getVectoreStore() ).asRetriever()

    const retrievelChain = await createRetrievalChain({
      retriever: retrievel,
      combineDocsChain: combinedDocsChain,
    })

    retrievelChain.invoke({
      input: currentMessageContent,
    });

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
