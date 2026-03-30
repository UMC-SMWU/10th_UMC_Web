import { useState } from 'react'
import './App.css'
import ContextPage from './Components/ContextPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ContextPage />
    </>
  )
}

export default App
