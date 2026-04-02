import { useState } from 'react'
import './App.css'
{/*import TodoBefore from './components/TodoBefore'*/}
import Todo from './components/Todo'
import { TodoProvider } from './contexts/TodoContext'

function App() {
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
