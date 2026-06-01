import React, { useReducer, useState, type ChangeEvent } from 'react'

type TActionType = 'CHANGE_DEPARTMENT' | 'RESET'

interface IState {
  department: string;
  error: string | null;
}

interface IAction {
  type: TActionType;
  payload?: string;
}

const reducer = (state:IState, action: IAction) => {
  const {type, payload} = action;

  switch(type){
    case 'CHANGE_DEPARTMENT': {
      const newDepartment = payload;
      const hasError = newDepartment !== '카드메이커'; 
      return {
        ...state, // 이전 값 유지
        department : hasError ? state.department : newDepartment,
        error: hasError ? '거부. 카드메이커만 가능' : null
      }
    }
    default:
      return state;
  }
} 

const UseReducerCompany = () => {
  const [state, dispatch] = useReducer(reducer, {
    department: 'Software Developer',
    error: null,
  });

  const [department, setDepartment] = useState('');

  const handleChangeDepartment = (e: ChangeEvent<HTMLInputElement>) => {
    setDepartment(e.target.value);
  }


  return (
    <div className='flex flex-col h-screen items-center justify-center gap-4'>
      <h1 className='text-2xl'>{state.department}</h1>
      {state.error && <p className='text-red-500 font-2xl'>{state.error}</p>}
      <input className='w-[600px] border p-4' placeholder='변경하시고 싶은 직무를 입력해주세요.' value={department} onChange={handleChangeDepartment}/>
      <button className='border' onClick={() => dispatch({type: 'CHANGE_DEPARTMENT', payload: department})}>직무 변경하기</button>
    </div>
  )
}

export default UseReducerCompany