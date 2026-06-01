import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// modalState 타입
export interface ModalState{
  isOpen : boolean;
};

// 초기값
const initialState: ModalState = {
  isOpen: false,
};

//ModalState 생성
const ModalState = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state) => {
      state.isOpen = true;
    },

    closeModal: (state) => {
      state.isOpen = false;
    },
  }
})

//action 내보내기 
export const {openModal, closeModal} = ModalState.actions

const modalReducer = ModalState.reducer;

export default modalReducer;