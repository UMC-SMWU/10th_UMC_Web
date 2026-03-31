// 1. 
const todoInput=document.getElementById('todo-input') as HTMLInputElement;
const todoForm=document.getElementById('todo-form') as HTMLFormElement;
const todoList=document.getElementById('todo-list') as HTMLUListElement;
const doneList=document.getElementById('done-list') as HTMLUListElement;

// 2. 할 일의 타입 정의
type Todo={
    id:number;
    text:string;
};

// - 할 일 목록 렌더링 함수 정의
let todos: Todo[]=[];
let doneTasks: Todo[]=[];

const renderTasks=() => {
    todoList.innerHTML='';
    doneList.innerHTML='';

    todos.forEach((todo) => {
        const li=createTodoElement(todo,false);
        todoList.appendChild(li);
    });

    doneTasks.forEach((todo) => {
        const li=createTodoElement(todo,true);
        doneList.appendChild(li);
    });
};

// 3. 할 일 텍스트 입력 처리 함수
const getTodoText=():string => {
    return todoInput.value.trim() // 공백 잘라줌
};


// 4. 할 일 추가 처리 함수
const addTodo=(text:string) => {
    todos.push({id:Date.now(), text});
    todoInput.value='';
    renderTasks();
};

// 5. 할 일 상태 변경
const completeTodo=(todo:Todo) => {
    todos=todos.filter((t):boolean => t.id!==todo.id); // 내가 선택한 것이 아닌 것들만 필터링
    doneTasks.push(todo);
    renderTasks();
};

// 6. 완료된 할 일 삭제 함수
const deleteTodo=(todo:Todo) => {
    doneTasks=doneTasks.filter((t):boolean=>t.id!==todo.id);
    renderTasks();
};

// 7. 할 일 아이템 생성 함수
const createTodoElement=(todo:Todo,isDone:boolean):HTMLElement=> {
    const li=document.createElement('li');
    li.classList.add('render-container_item');
    li.textContent=todo.text;

    const button=document.createElement('button');
    button.classList.add('render-container_item-btn');

    if (isDone) {
        button.textContent='삭제';
        button.style.backgroundColor='#dc3545';

        button.addEventListener('click',():void => {
            deleteTodo(todo);
        });
    }
    else {
        button.textContent='완료';
        button.style.backgroundColor='#28a745';

        button.addEventListener('click', ():void=> {
            completeTodo(todo);
        });
    }

    li.appendChild(button);
    return li; // 타입스트립트가 아니면 오류를 찾기 어려웠을 것
};

//8. 폼 제출 이벤트 리스너
todoForm.addEventListener('submit', (event:Event) => {
    event.preventDefault();
    const text=getTodoText();
    if (text) {
        addTodo(text);
    }
});

renderTasks();