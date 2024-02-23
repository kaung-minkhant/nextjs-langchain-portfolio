// import { getVectoreStore } from "../src/lib/chromadb";

import {ChromaClient} from 'chromadb'
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";

async function sample() {
  const client = new ChromaClient({
    path: "http://localhost:8500"
  })

  const collection = await client.getCollection({ name: 'test-vectors', embeddingFunction: new OllamaEmbeddings() })
  const count = await collection.count()
  client.deleteCollection
  const query = await collection.query({
    queryTexts: "developer"
  })
  console.log({collection, count, query})
}

sample();
