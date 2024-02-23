import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { DocumentInterface } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { getVectoreStore } from "../src/lib/chromadb";
import { ChromaClient } from "chromadb";

import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";

async function generateVectors() {
  const client = new ChromaClient({
    path: "http://localhost:8500",
  });

  await client.deleteCollection({
    name: "test-vectors",
  });

  const vectorStore = await getVectoreStore();

  const loader = new DirectoryLoader("src/app", {
    ".tsx": (path) => new TextLoader(path),
  });
  const docs = (await loader.load())
    .filter((doc) => doc.metadata.source.endsWith("page.tsx"))
    .map((doc: DocumentInterface): DocumentInterface => {
      const url =
        doc.metadata.source
          .replace(/\\/g, "")
          .split("src/app")[1]
          .split("/page.")[0] || "/";

      const trimmedPageContent = doc.pageContent
        .replace(/ className=(["']).*\1| className={.*}/gm, "") // remove className
        .replace(/^import.*$/gm, "") // remove imports
        .replace(/^\s*/gm, ""); // remove new lines
      return {
        pageContent: trimmedPageContent,
        metadata: {
          url,
        },
      };
    });

  const splitter = RecursiveCharacterTextSplitter.fromLanguage("html", {
    chunkOverlap: 20,
    chunkSize: 175,
  });

  const splittedText = await splitter.splitDocuments(docs);

  await vectorStore.addDocuments(splittedText)

  // const retriever = vectorStore.asRetriever();
  // const relDocs = await retriever.getRelevantDocuments("name of person");

  // console.log({ relDocs });
}

generateVectors();

async function test() {
  const chroma = await Chroma.fromTexts(
    [
      `Tortoise: Labyrinth? Labyrinth? Could it Are we in the notorious Little
          Harmonic Labyrinth of the dreaded Majotaur?`,
      "Achilles: Yiikes! What is that?",
      `Tortoise: They say-although I person never believed it myself-that an I
          Majotaur has created a tiny labyrinth sits in a pit in the middle of
          it, waiting innocent victims to get lost in its fears complexity.
          Then, when they wander and dazed into the center, he laughs and
          laughs at them-so hard, that he laughs them to death!`,
      "Achilles: Oh, no!",
      "Tortoise: But it's only a myth. Courage, Achilles.",
    ],
    [{ id: 2 }, { id: 1 }, { id: 3 }],
    new OllamaEmbeddings({
      model: "llama2",
    }),
    {
      collectionName: "test-vectors",
      url: "http://localhost:8500",
    },
  );

  const client = new ChromaClient({
    path: "http://localhost:8500",
  });

  await client.deleteCollection({
    name: "test-vectors",
  });

  const retriever = chroma.asRetriever()

  const docs = await retriever.getRelevantDocuments("scared")

  // const response = await chroma.similaritySearch("scared", 2);
  
  console.log({docs})
}

// test();
