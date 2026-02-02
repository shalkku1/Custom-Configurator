import { useState, useRef } from 'react'
import './App.css'

const API_URL = ''

function App() {
  const [text, setText] = useState('')
  const [gptResponse, setGptResponse] = useState('')
  const [grokResponse, setGrokResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (file.type === 'application/pdf') {
      setUploadedFile(file)
    } else {
      alert('Please upload a PDF file')
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

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

        <div
          className={`upload-area ${isDragging ? 'dragging' : ''} ${uploadedFile ? 'has-file' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept=".pdf,application/pdf"
            hidden
          />
          {uploadedFile ? (
            <div className="uploaded-file">
              <span className="file-icon">PDF</span>
              <span className="file-name">{uploadedFile.name}</span>
              <button className="remove-file" onClick={handleRemoveFile}>
                Remove
              </button>
            </div>
          ) : (
            <>
              <div className="upload-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <p className="upload-text">Drag and drop a PDF file here</p>
              <p className="upload-or">or</p>
              <button className="upload-button" onClick={handleUploadClick}>
                Upload PDF
              </button>
            </>
          )}
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
