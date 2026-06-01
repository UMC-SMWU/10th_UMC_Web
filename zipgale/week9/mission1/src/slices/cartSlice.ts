import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import cartItems from "../constants/cartItems";
import type { CartItems } from "../types/cart";

// cartState 타입
export interface CartState {
  cartItems: CartItems;
  amount: number;
  total: number;
}

// 초기값
const initialState: CartState = {
  cartItems: cartItems,
  amount: 0,
  total: 0,
};

// CartSlice 생성
// createSlice -> reduxToolKit에서 제공.
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: { // action 관련 정의
    // 증가
    increase: (state, action: PayloadAction<{id: string}>) => {
      const itemId = action.payload.id;
      // 이 아이디를 통해서, 전체 음반 중에 내가 클릭한 음반을 찾기
      const item = state.cartItems.find((cartItem) => cartItem.id === itemId);
      if(item){
        item.amount += 1;
      }
    },

    // 감소
    decrease: (state, action: PayloadAction<{id: string}>) => {
      const itemId = action.payload.id;
      // 이 아이디를 통해서, 전체 음반 중에 내가 클릭한 음반을 찾기
      const item = state.cartItems.find((cartItem) => cartItem.id === itemId);
      if(item){
        item.amount -= 1;
      }
    },

    // 아이템 제거 (수가 0일 때 리스트에서 삭제)
    removeItem: (state, action: PayloadAction<{id: string}>) => {
      const itemId = action.payload.id;
      state.cartItems = state.cartItems.filter((cartItem) => cartItem.id !== itemId)
    },

    // clearCart 장바구니 비우기
    clearCart: (state) => {state.cartItems = []},

    // 총액 계산
    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;

      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * parseInt(item.price);
      })

      state.amount = amount;
      state.total = total;
    }
  }
})

//action내보내기
export const {increase, decrease, removeItem, clearCart, calculateTotals} = cartSlice.actions

//duck pattern: reducer는 export default로 내보내야 한다.
const cartReducer = cartSlice.reducer;

export default cartReducer;