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

}

generateVectors();