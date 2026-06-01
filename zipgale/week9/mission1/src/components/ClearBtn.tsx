import React from 'react'
import { useDispatch, useSelector } from '../hooks/useCustomRedux';
import { clearCart } from '../slices/cartSlice';
import { closeModal, openModal } from '../slices/modalSlice';
import Modal from './Modal';

const ClearBtn = () => {

  const modalDispatch = useDispatch();
  
  const handleOpenModal = () => {
    modalDispatch(openModal());
  }

  return (
    <div>
      <Modal />
      <button className='border p-4 rounded-md cursor-pointer'
        onClick={handleOpenModal}
      >
        장바구니 초기화
      </button>
    </div>
  )
}

export default ClearBtn