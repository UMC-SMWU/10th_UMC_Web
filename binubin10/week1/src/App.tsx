import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';
import heroImg from './assets/hero.png';
import './App.css';

function App() {
  // [ ] 상태(State) 관리
  const [todos, setTodos] = useState<Todo[]>([]); // 투두 목록 배열
  const [inputValue, setInputValue] = useState<string>(''); // 입력창 값

  // [ ] 할 일 추가 함수
  const addTodo = () => {
    if (inputValue.trim() === '') return; // 빈칸 입력 방지
    const newTodo: Todo = {
      id: Date.now(), // 고유한 ID 생성
      task: inputValue,
      isDone: false,
    };
    setTodos([...todos, newTodo]); // 기존 목록에 추가
    setInputValue(''); // 입력창 초기화
  };

  // 엔터키로 추가하기 기능
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  // [ ] 완료 상태 토글 함수 (할 일 <-> 완료 이동)
  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isDone: !todo.isDone } : todo,
      ),
    );
  };

  // [ ] 할 일 삭제 함수
  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // 데이터를 '할 일'과 '완료' 목록으로 분리
  const doingTodos = todos.filter((todo) => !todo.isDone);
  const doneTodos = todos.filter((todo) => todo.isDone);

  return (
    // [ ] ToDo List UI 구현 (BEM 적용)
    <div className="todo">
      <div className="todo__wrapper">
        <h1 className="todo__title">PINO TODO</h1>

        {/* 입력 영역 */}
        <div className="todo__form">
          <input
            className="todo__input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="할 일 입력"
          />
          <button className="todo__submit" onClick={addTodo}>
            할 일 추가
          </button>
        </div>

        {/* 목록 영역 */}
        <div className="todo__container">
          {/* 해야 할 일 */}
          <section className="todo__section">
            <h2 className="todo__subtitle">할 일</h2>
            <ul className="todo__list">
              {doingTodos.map((todo) => (
                <li key={todo.id} className="todo__item todo__item--doing">
                  <span className="todo__task">{todo.task}</span>
                  <button
                    className="todo__btn todo__btn--complete"
                    onClick={() => toggleTodo(todo.id)}
                  >
                    완료
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* 완료한 일 */}
          <section className="todo__section">
            <h2 className="todo__subtitle">완료</h2>
            <ul className="todo__list">
              {doneTodos.map((todo) => (
                <li key={todo.id} className="todo__item todo__item--done">
                  <span className="todo__task">{todo.task}</span>
                  <button
                    className="todo__btn todo__btn--delete"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
