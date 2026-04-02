
import { useState, type FormEvent } from 'react';
import { useTodo } from '../contexts/TodoContext';

  const TodoForm = () => {
    const [input, setInput] = useState<string>('');
    const { addTodo } = useTodo();
      
    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
      e.preventDefault();
      const text = input.trim();
      
      if(text){
        addTodo(text);
        setInput('');
      }
    }
    return (
      <form onSubmit = {handleSubmit} className='todo-container__form'>
        <input type='text' 
        value={input}
        onChange={(e) => setInput(e.target.value)} // 값이 변경될 때마다 인지
        className='todo-container__input' 
        placeholder='할일 입력'
        required/>
        <button type='submit' className='todo-container__button' >
          할일 추가
        </button>
      </form>
  )
  };

export default TodoForm;
