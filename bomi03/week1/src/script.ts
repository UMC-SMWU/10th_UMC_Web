// 1. HTML 요소 선택
const todoInput = document.getElementById('todo-input') as HTMLInputElement; // HTML의 Input에 대한 요소이기 때문에 HTMLInputElement로 정의하면,
                                                                             // todoInput 다음 . 을 찍을 때 input 요소일 때만 할 수 있는 작업들을 알려줌 -> 타입 안정성을 확보하며 개발할 수 있음
const todoForm = document.getElementById('todo-form') as HTMLFormElement;    // 상단의 HTMLInputElement과 마찬가지로 HTMLFormElement로 정의
const todoList = document.getElementById('todo-list') as HTMLUListElement;  // 상단의 HTMLInputElement과 마찬가지로 HTMLUListElement로 정의
const doneList = document.getElementById('done-list') as HTMLUListElement;  // 상단의 HTMLInputElement과 마찬가지로 HTMLUListElement로 정의

// 2. 할 일이 어떻게 생겼는지 Type을 정의
type Todo = {
    id: number;
    text: string;
};

let todos: Todo[] = [];  // Todo의 타입에 맞게 들어가야 한다고 정의, 다른 타입이 들어가면 에러 발생
let doneTasks: Todo[] = [];

// 3. 할 일 목록 렌더링 하는 함수를 정의
const renderTasks = (): void => {
    todoList.innerHTML = '';
    doneList.innerHTML = '';
    
    todos.forEach((todo: Todo): void => {
        const li = createTodoElement(todo, false);
        todoList.appendChild(li);
    });

    doneTasks.forEach((todo: Todo): void => {
        const li = createTodoElement(todo, true);
        doneList.appendChild(li);
    });
};

// 4. 할 일 텍스트 입력 처리 함수
const getTodoText = (): string => {
    return todoInput.value.trim();  // 입력된 텍스트에서 앞뒤 공백 제거
};

// 5. 할 일 추가 처리 함수
const addTodo = (text: string): void => {
    todos.push({ id: Date.now(), text });  // todos 배열에 넣어줄 거니까 push 사용 / id는 length를 늘려도 되고, 현재 시간 기준으로도 만들 수 있음 / 원래 text: text이지만, key와 value가 같으면 하나로 줄여서 표현 가능
    todoInput.value = '';                  // 입력을 했으면 input을 비워줘야 하니까 ''로 초기화
    renderTasks();                          // 다시 렌더링
};

// 6. 할 일 상태 변경 (완료로 이동)
const compleTodo = (todo: Todo): void => {
    todos = todos.filter((t): boolean => t.id !== todo.id);  // filter는 배열에서 특정 조건을 만족하는 요소들만 남기는 메서드, 여기서는 현재 완료된 할 일을 제외한 나머지 할 일들을 남김
    doneTasks.push(todo);  // 완료된 할 일을 doneTasks 배열에 추가
    renderTasks();        // 다시 렌더링
};

// 7. 완료된 할 일 삭제 함수
const deleteTodo = (todo: Todo): void => {
    doneTasks = doneTasks.filter((t): boolean => t.id !== todo.id);
    renderTasks();
};

// 8. 할 일 아이템 생성 함수 (완료 여부에 따라 버튼 텍스트나 색상 설정)
const createTodoElement = (todo: Todo, isDone: boolean): HTMLLIElement => {
    const li = document.createElement('li');
    li.classList.add('render-container__item');
    li.textContent = todo.text;

    const button = document.createElement('button');
    button.classList.add('render-container__item-button');

    if (isDone) {
        button.textContent = '삭제';
        button.style.backgroundColor = '#dc3545';
    } else {
        button.textContent = '완료';
        button.style.backgroundColor = '#28a745';
    }

    button.addEventListener('click', (): void => {
        if (isDone) {
            deleteTodo(todo);
        } else {
            compleTodo(todo);
        }
    });

    li.appendChild(button);
    return li;
};

// 9. 폼 제출 이벤트 리스너
todoForm.addEventListener('submit', (e: Event): void => {
    e.preventDefault();                // 할 일 추가 버튼을 클릭할 때마다 페이지가 새로고침되면서 값이 초기화되는 걸 방지해 줌
    const text = getTodoText();
    if (text) {                       // 텍스트가 있는 경우
        addTodo(text);
    }
});

renderTasks();