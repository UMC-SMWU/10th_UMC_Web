import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import UseReducerPage from './UseReducer/UseReducerPage'
import UseReducerCompany from './UseReducer/UseReducerCompany'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <UseReducerPage />
      {/*<UseReducerCompany />*/}
    </>
  )
}

export default App
