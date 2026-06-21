import { closeModal } from '../features/modal/modalSlice';
import { useDispatch } from 'react-redux';
import { useCartActions } from '../hooks/useCartStore';

const Modal = () => {
  const dispatch = useDispatch();
  const { clearCart } = useCartActions();

  return (
    <aside className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm w-full">
        <h4 className="text-lg font-bold mb-6">정말 삭제하시겠습니까?</h4>
        <div className="flex justify-center gap-4">
          <button
            type="button"
            className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
            onClick={() => dispatch(closeModal())}
          >
            아니요
          </button>
          <button
            type="button"
            className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            onClick={() => {
              clearCart();
              dispatch(closeModal());
            }}
          >
            네
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Modal;
