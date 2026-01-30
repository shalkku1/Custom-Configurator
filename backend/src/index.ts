import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { getCompletion, ChatMessage } from './azure-client.js'

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

interface ChatRequest {
  message: string
  model: 'gpt' | 'grok'
}

interface ChatResponse {
  model: string
  response: string
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message, model } = req.body as ChatRequest

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    const deploymentName =
      model === 'grok'
        ? process.env.AZURE_OPENAI_DEPLOYMENT_GROK!
        : process.env.AZURE_OPENAI_DEPLOYMENT_GPT!

    const messages: ChatMessage[] = [
      { role: 'user', content: message },
    ]

    const response = await getCompletion(deploymentName, messages)

    res.json({ model: deploymentName, response } as ChatResponse)
  } catch (error) {
    console.error('Error calling Azure OpenAI:', error)
    res.status(500).json({ error: 'Failed to get response from LLM' })
  }
})

app.post('/api/chat/both', async (req, res) => {
  try {
    const { message } = req.body as { message: string }

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    const messages: ChatMessage[] = [
      { role: 'user', content: message },
    ]

    const [gptResponse, grokResponse] = await Promise.all([
      getCompletion(process.env.AZURE_OPENAI_DEPLOYMENT_GPT!, messages),
      getCompletion(process.env.AZURE_OPENAI_DEPLOYMENT_GROK!, messages),
    ])

    res.json({
      gpt: { model: process.env.AZURE_OPENAI_DEPLOYMENT_GPT, response: gptResponse },
      grok: { model: process.env.AZURE_OPENAI_DEPLOYMENT_GROK, response: grokResponse },
    })
  } catch (error) {
    console.error('Error calling Azure OpenAI:', error)
    res.status(500).json({ error: 'Failed to get response from LLMs' })
  }
})

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', endpoint: process.env.AZURE_OPENAI_ENDPOINT })
})

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`)
  console.log(`Azure OpenAI Endpoint: ${process.env.AZURE_OPENAI_ENDPOINT}`)
})
