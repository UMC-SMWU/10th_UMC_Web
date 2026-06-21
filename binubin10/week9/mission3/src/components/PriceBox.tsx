import { useDispatch } from 'react-redux';
import { openModal } from '../features/modal/modalSlice';
import { useCartActions, useCartInfo } from '../hooks/useCartStore';

const PriceBox = () => {
  const { total } = useCartInfo();
  const { clearCart } = useCartActions();
  const dispatch = useDispatch();

  const handleInitializeCart = () => {
    dispatch(openModal());
  };

  return (
    <div className="p-12 flex justify-between">
      <button
        onClick={handleInitializeCart}
        className="border p-4 rounded-md cursor-pointer"
      >
        장바구니 초기화
      </button>
      <div>총 가격: {total}원</div>
    </div>
  );
};

export default PriceBox;
