import { useCartStore } from "../store/useCartStore";

const Modal = () => {
  const { clearCart, closeModal } = useCartStore();

  const handleCancel = () => {
    closeModal();
  };

  const handleConfirm = () => {
    clearCart();
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-82 rounded-lg bg-white p-6 text-center shadow-lg">
        <p className="mb-6 text-lg font-semibold">
          장바구니를 모두 비우시겠습니까?
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleCancel}
            className="rounded bg-gray-300 px-4 py-2"
          >
            아니요
          </button>

          <button
            onClick={handleConfirm}
            className="rounded bg-red-500 px-4 py-2 text-white"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;