import { useReducer, useState } from "react"

// state에 대한 interface(type)
interface IState {
  counter: number;
  error: String | null;
}

// reducer에 대한 interface
interface IAction {
  type: 'INCREASE' | 'DECREASE' | 'RESET_TO_ZERO';
  payload?: number; // 직접 전달할 값
}

function reducer(state: IState, action: IAction){
  const {type, payload} = action;

  switch(type){
    case 'INCREASE':{ // increase type action정의
      return {
        ... state, // 원본 배열 직접 수정 x, 복사본으로 
        counter : state.counter + 1, // 원본 배열 직접 수정 시 데이터 잃을 위험 있음
      }
    }
    case 'DECREASE':{
      return {
        ...state,
        counter: state.counter - 1
      }
    }
    case 'RESET_TO_ZERO': {
      return {
        ...state,
        counter: 0
      }
    }

    default:
      return state; // 초기 상태 반환
  }
}

const UseReducerPage = () => {
  // 1. useState
  const [count, setCount] = useState(0);

  // 2. useReducer
  // 초기값, 값 변경 함수(action을 정의 - 복사본을 사용, 불변성 유지), 
  // reducer, initial state
  const [state, dispatch] = useReducer(reducer, {
    counter: 0,
    error : ''
  })
  const handleIncrease = () => {
    setCount(count+1);
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-2">
      <div>
        <h2 className="text-3xl">useState</h2>
        <h3>useState 훅 사용: {count}</h3>
        <button onClick={handleIncrease}>Increase</button>
      </div>
      <div>
        <h2 className="text-3xl">useReducer</h2>
        <h3>useReducer 훅 사용: {state.counter}</h3>
        <div className="flex gap-4">
          <button onClick={() => dispatch({
            type : 'INCREASE',
            payload : 3,
          })}>Increase</button>
          <button onClick={() => dispatch({
            type : 'DECREASE'
          })}>decrease</button>
          <button onClick={() => dispatch({
            type : 'RESET_TO_ZERO'
          })}>reset</button>
        </div>
      </div>
    </div>
  )
}

export default UseReducerPage;