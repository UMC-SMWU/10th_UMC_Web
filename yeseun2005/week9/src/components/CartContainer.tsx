import { useDispatch, useSelector } from "react-redux";
import CartItem from "./CartItem";
import Modal from "./Modal";
import type { AppDispatch, RootState } from "../app/store";
import { openModal } from "../features/modal/modalSlice";
import { useCartStore } from "../store/useCartStore";

const CartContainer = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { cartItems } = useCartStore();
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);

  const amount = cartItems.reduce((sum, item) => sum + item.amount, 0);
  const total = cartItems.reduce(
  (sum, item) => sum + Number(item.price) * item.amount,
  0
);

  if (cartItems.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="mb-6 text-3xl font-bold">장바구니</h1>
        <p className="text-gray-500">장바구니가 비어 있습니다.</p>

        {isOpen && <Modal />}
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
            onClick={() => dispatch(openModal())}
            className="rounded-md border px-6 py-3 font-semibold hover:bg-gray-100"
          >
            전체 삭제
          </button>
        </div>
      </section>

      {isOpen && <Modal />}
    </main>
  );
};

export default CartContainer;