import { Ollama } from 'langchain/llms/ollama';
import { PromptTemplate } from 'langchain/prompts';
import { LLMChain } from 'langchain/chains';
import { semanticSearch } from './vectorDb';

// Initialize Ollama with your chosen model
// Make sure to run: ollama run llama2 (or mistral, neural-chat)
const model = new Ollama({
  baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  model: process.env.OLLAMA_MODEL || 'llama2', // Change to 'mistral' or 'neural-chat' if preferred
});

interface DocumentAnalysisResult {
  summary: string;
  keyPoints: string[];
  topics: string[];
}

interface QueryResult {
  answer: string;
  sources: Array<{
    content: string;
    filename: string;
    relevance: number;
  }>;
  query: string;
}

/**
 * Analyze a document without a query
 */
export async function analyzeDocument(
  documentContent: string
): Promise<DocumentAnalysisResult> {
  const prompt = PromptTemplate.fromTemplate(
    `Analyze the following document and provide:
1. A concise summary (2-3 sentences)
2. Key points (3-5 bullet points)
3. Main topics covered (3-5 topics)

Document:
{document}

Provide your response in the following JSON format:
{
  "summary": "...",
  "keyPoints": ["...", "..."],
  "topics": ["...", "..."]
}`
  );

  const chain = new LLMChain({ llm: model, prompt });

  try {
    const result = await chain.call({ document: documentContent });
    const parsedResult = JSON.parse(result.text);
    return parsedResult;
  } catch (error) {
    console.error('Error analyzing document:', error);
    // Return default analysis if parsing fails
    return {
      summary: documentContent.substring(0, 200),
      keyPoints: ['Document analyzed'],
      topics: ['General'],
    };
  }
}

/**
 * Answer a query using semantic search and LLM
 */
export async function answerQuery(query: string): Promise<QueryResult> {
  // Step 1: Search for relevant documents
  const relevantDocs = await semanticSearch(query, 5);

  if (relevantDocs.length === 0) {
    return {
      answer:
        'I could not find relevant information in the uploaded documents to answer your question.',
      sources: [],
      query,
    };
  }

  // Step 2: Prepare context from retrieved documents
  const context = relevantDocs
    .map(
      (doc, index) =>
        `[Source ${index + 1} (Relevance: ${(doc.score * 100).toFixed(1)}%)]:\n${doc.content}`
    )
    .join('\n\n');

  // Step 3: Create prompt with context
  const prompt = PromptTemplate.fromTemplate(
    `You are a helpful assistant answering questions based on provided documents.
Use the following documents to answer the question. If the answer is not in the documents, say so.
Provide a clear, concise answer based on the context.

Context from documents:
{context}

Question: {question}

Answer:`
  );

  const chain = new LLMChain({ llm: model, prompt });

  try {
    const result = await chain.call({ context, question: query });

    return {
      answer: result.text.trim(),
      sources: relevantDocs.map((doc) => ({
        content: doc.content.substring(0, 200) + '...', // First 200 chars
        filename: doc.metadata.filename || 'Unknown',
        relevance: Math.round(doc.score * 100) / 100,
      })),
      query,
    };
  } catch (error) {
    console.error('Error answering query:', error);
    throw error;
  }
}

/**
 * Combined: Analyze document and answer query if provided
 */
export async function processDocument(
  documentContent: string,
  query?: string
): Promise<{
  analysis?: DocumentAnalysisResult;
  answer?: QueryResult;
}> {
  const result: any = {};

  // Always analyze the document
  result.analysis = await analyzeDocument(documentContent);

  // If query is provided, answer it
  if (query && query.trim()) {
    result.answer = await answerQuery(query);
  }

  return result;
}
