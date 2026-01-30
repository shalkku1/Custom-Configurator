# Custom Configurator

A web application for comparing responses from multiple Large Language Models (LLMs) side by side. Send a single prompt and instantly see how different AI models respond.

## Description

Custom Configurator provides a clean, intuitive interface for interacting with multiple LLMs simultaneously. Users can input a message and receive responses from both GPT and Grok models displayed in parallel, making it easy to compare outputs, evaluate response quality, and understand the differences between AI models.

## Features

- Side-by-side comparison of LLM responses
- Real-time API calls to multiple models in parallel
- Clean, modern UI inspired by conversational AI interfaces
- Responsive design with Gofore brand styling

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and development server
- **CSS3** - Custom styling with CSS variables

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type-safe JavaScript
- **OpenAI SDK** - Azure OpenAI client

## Integrations

### Azure AI Foundry (Microsoft Foundry)
The application connects to Azure AI Foundry to access deployed LLM models:
- **GPT** - OpenAI's GPT model
- **Grok** - xAI's Grok model

Both models are accessed through Azure's unified Model Inference API, enabling consistent request/response patterns across different providers.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                        │
│                        localhost:5173                           │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────────┐   │
│  │   GPT-4o      │  │     Grok      │  │   User Input      │   │
│  │   Response    │  │   Response    │  │   Textarea        │   │
│  └───────────────┘  └───────────────┘  └───────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ /api/chat/both (via Vite proxy)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Backend (Express)                         │
│                        localhost:3001                           │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                   POST /api/chat/both                   │    │
│  │              Promise.all([GPT, Grok])                   │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Azure OpenAI SDK
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Azure AI Foundry                           │
│  ┌─────────────────────┐       ┌─────────────────────────┐     │
│  │    GPT Deployment   │       │    Grok Deployment      │     │
│  └─────────────────────┘       └─────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

## Getting Started

### Prerequisites
- Node.js 18+
- Azure AI Foundry account with deployed models

### Installation

1. Clone the repository
```bash
git clone https://github.com/shalkku1/Custom-Configurator.git
cd Custom-Configurator
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd backend
npm install
```

4. Configure environment variables
```bash
cp .env.example .env
```

Edit `backend/.env` with your Azure credentials:
```
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_DEPLOYMENT_GPT=your-gpt-deployment
AZURE_OPENAI_DEPLOYMENT_GROK=your-grok-deployment
```

### Running the Application

Start the backend:
```bash
cd backend
npm run dev
```

Start the frontend (in a new terminal):
```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Author

Powered by Matti Salonen
