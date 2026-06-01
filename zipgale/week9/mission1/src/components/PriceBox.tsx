import React from 'react'
import { useDispatch, useSelector } from '../hooks/useCustomRedux';
import { clearCart } from '../slices/cartSlice';
import { closeModal, openModal } from '../slices/modalSlice';
import Modal from './Modal';
import ClearBtn from './ClearBtn';

const PriceBox = () => {
  const {total} = useSelector((state) => state.cart);


  return (
    <div className='p-12 flex justify-between'>
      <ClearBtn />
      <div>총 가격: {total}원</div>
    </div>
  )
}

export default PriceBox