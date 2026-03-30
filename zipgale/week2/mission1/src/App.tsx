import { useState } from 'react'
import './App.css'
{/*import TodoBefore from './components/TodoBefore'*/}
import Todo from './components/Todo'
import { TodoProvider } from './contexts/TodoCOntext'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <TodoProvider>
      <Todo />
    </TodoProvider>
      {/*<TodoBefore/>*/}
    </>
  )
}

export default App
