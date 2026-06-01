import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../redux/store';
import {
  clearCart,
  calculateTotals,
} from '../redux/slices/cartSlice';
import CartItem from './CartItem';

const CartContainer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cartItems, amount, total } = useSelector(
    (state: RootState) => state.cart
  );

  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems, dispatch]);

  if (cartItems.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="mb-6 text-3xl font-bold">장바구니</h1>
        <p className="text-gray-500">장바구니가 비어 있습니다.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-center text-3xl font-bold">장바구니</h1>

      <section className="rounded-lg bg-white p-8 shadow">
        {cartItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}

        <div className="mt-6 flex items-center justify-between text-lg font-bold">
          <span>총 수량: {amount}개</span>
          <span>총 금액: {total.toLocaleString()}원</span>
        </div>

        <div className="mt-8 flex justify-center">
            <button
            onClick={() => dispatch(clearCart())}
            className="rounded-md border px-6 py-3 font-semibold hover:bg-gray-100"
            >
                전체 삭제
            </button>
        </div>
    </section>
    </main>
  );
};


export default CartContainer;