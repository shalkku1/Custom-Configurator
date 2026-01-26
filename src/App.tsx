import { useState } from 'react'

function App() {
  const [text, setText] = useState('')

  const handleClick = () => {
    alert(text)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Custom Configurator</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your text here..."
        rows={5}
        cols={40}
        style={{ display: 'block', marginBottom: '10px' }}
      />
      <button onClick={handleClick}>Show Alert</button>
    </div>
  )
}

export default App
