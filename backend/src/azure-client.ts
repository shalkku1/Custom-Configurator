import { AzureOpenAI } from 'openai'

const endpoint = process.env.AZURE_OPENAI_ENDPOINT!
const apiKey = process.env.AZURE_OPENAI_API_KEY!

export const azureClient = new AzureOpenAI({
  endpoint,
  apiKey,
  apiVersion: '2024-10-21',
})

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export async function getCompletion(
  deploymentName: string,
  messages: ChatMessage[]
): Promise<string> {
  const response = await azureClient.chat.completions.create({
    model: deploymentName,
    messages,
    max_completion_tokens: 1000,
  })

  return response.choices[0]?.message?.content ?? ''
}
