import {Chroma} from '@langchain/community/vectorstores/chroma'
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
export async function getVectoreStore() {
  return Chroma.fromExistingCollection(
    new OllamaEmbeddings({
      model: "llama2",
    }),
    {
      collectionName: "test-vectors",
      url: "http://localhost:8500",
    },
  );
}
