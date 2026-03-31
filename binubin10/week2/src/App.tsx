import React, { useState } from 'react';
import './App.css';

// 타입 정의
interface Task {
  id: number;
  text: string;
}

export default function App() {
  // 1. 상태 관리 (State)
  const [todoInput, setTodoInput] = useState<string>(''); // 입력창
  const [todos, setTodos] = useState<Task[]>([]); // 해야 할 일
  const [doneTasks, setDoneTasks] = useState<Task[]>([]); // 완료된 일

  // 2. 할 일 추가 기능
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!todoInput.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      text: todoInput.trim(),
    };

    setTodos([...todos, newTask]); // 기존 배열 복사 후 새 항목 추가
    setTodoInput(''); // 입력창 초기화
  };

  // 3. 완료 처리 기능 (할 일 -> 완료)
  const handleComplete = (task: Task) => {
    setTodos(todos.filter((t) => t.id !== task.id)); // 해야 할 일에서 제거
    setDoneTasks([...doneTasks, task]); // 완료 목록에 추가
  };

  // 4. 삭제 기능 (완료 목록에서 제거)
  const handleDelete = (id: number) => {
    setDoneTasks(doneTasks.filter((t) => t.id !== id));
  };

  return (
    <div className="todo-container">
      <h1 className="todo-container__header">PINO TODO</h1>

      {/* 입력 폼 */}
      <form className="todo-container__form" onSubmit={handleAddTodo}>
        <input
          type="text"
          className="todo-container__input"
          placeholder="할 일 입력"
          value={todoInput}
          onChange={(e) => setTodoInput(e.target.value)}
          required
        />
        <button type="submit" className="todo-container__button">
          할 일 추가
        </button>
      </form>

      <div className="render-container">
        {/* 해야 할 일 섹션 */}
        <div className="render-container__section">
          <h2 className="render-container__title">할 일</h2>
          <ul className="render-container__list">
            {todos.map((task) => (
              <li key={task.id} className="render-container__item">
                <span>{task.text}</span>
                <button
                  className="render-container__item-button btn-complete"
                  onClick={() => handleComplete(task)}
                >
                  완료
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* 완료 섹션 */}
        <div className="render-container__section">
          <h2 className="render-container__title">완료</h2>
          <ul className="render-container__list">
            {doneTasks.map((task) => (
              <li key={task.id} className="render-container__item">
                <span>{task.text}</span>
                <button
                  className="render-container__item-button btn-delete"
                  onClick={() => handleDelete(task.id)}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
