import { useState } from 'react'
import './App.css'

const API_URL = ''

function App() {
  const [text, setText] = useState('')
  const [gptResponse, setGptResponse] = useState('')
  const [grokResponse, setGrokResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!text.trim() || loading) return

    setLoading(true)
    setGptResponse('')
    setGrokResponse('')

    try {
      const response = await fetch(`${API_URL}/api/chat/both`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      setGptResponse(data.gpt?.response || 'No response')
      setGrokResponse(data.grok?.response || 'No response')
    } catch (error) {
      console.error('Error:', error)
      setGptResponse('Error fetching response')
      setGrokResponse('Error fetching response')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Custom Configurator</h1>
      </header>

      <main className="main-content">
        <div className="welcome-text">
          <h2>How can I help you today?</h2>
          <p>Enter your message below to get started</p>
        </div>

        <div className="display-areas">
          <div className="display-container">
            <label className="display-label">GPT-4o</label>
            <textarea
              className="display-textarea"
              placeholder="GPT-4o response will appear here..."
              value={loading ? 'Loading...' : gptResponse}
              readOnly
            />
          </div>
          <div className="display-container">
            <label className="display-label">Grok</label>
            <textarea
              className="display-textarea"
              placeholder="Grok response will appear here..."
              value={loading ? 'Loading...' : grokResponse}
              readOnly
            />
          </div>
        </div>

        <div className="input-container">
          <textarea
            className="textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            disabled={loading}
          />
          <div className="input-footer">
            <button
              className="submit-button"
              onClick={handleSubmit}
              disabled={!text.trim() || loading}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </div>
      </main>

      <footer className="footer">
        Powered by Matti Salonen
      </footer>
    </div>
  )
}

export default App
