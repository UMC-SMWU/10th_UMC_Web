import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import cartItems, { type CartItemType } from "../../constants/cartItems";

type CartState = {
  cartItems: CartItemType[];
};

const initialState: CartState = {
  cartItems,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },

    removeItem: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload
      );
    },

    increase: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((item) => item.id === action.payload);
      if (item) {
        item.amount += 1;
      }
    },

    decrease: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((item) => item.id === action.payload);

      if (item && item.amount > 1) {
        item.amount -= 1;
      } else {
        state.cartItems = state.cartItems.filter(
          (item) => item.id !== action.payload
        );
      }
    },
  },
});

export const { clearCart, removeItem, increase, decrease } = cartSlice.actions;
export default cartSlice.reducer;