import { useDispatch } from "react-redux";
import type { AppDispatch } from "../app/store";
import type { CartItemType } from '../constants/cartItems';
import { removeItem, increase, decrease } from "../features/cart/cartSlice";


type CartItemProps = {
  item: CartItemType;
};

const CartItem = ({ item }: CartItemProps) => {
  const dispatch = useDispatch<AppDispatch>();
  
  return (
    <div className="flex items-center justify-between border-b py-6">
      <div className="flex items-center gap-4">
        <img
          src={item.img}
          alt={item.title}
          className="h-24 w-24 rounded-md object-cover"
        />

        <div>
          <h3 className="font-semibold">{item.title}</h3>
          <p className="text-sm text-gray-500">{item.singer}</p>
          <p className="mt-1 font-medium">{Number(item.price).toLocaleString()}원</p>

          <button
            onClick={() => dispatch(removeItem(item.id))}
            className="mt-2 text-sm text-red-500"
          >
            삭제
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch(decrease(item.id))}
          className="rounded bg-gray-200 px-3 py-1"
        >
          -
        </button>

        <span className="font-semibold">{item.amount}</span>

        <button
          onClick={() => dispatch(increase(item.id))}
          className="rounded bg-gray-200 px-3 py-1"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default CartItem;