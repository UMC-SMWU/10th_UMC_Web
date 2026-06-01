import React from 'react'
import { useDispatch, useSelector } from '../hooks/useCustomRedux';
import { clearCart } from '../slices/cartSlice';
import { closeModal } from '../slices/modalSlice';

const Modal = () => {
  const {isOpen} = useSelector((state) => state.modal);
  const cartDispatch = useDispatch();
  const modalDispatch = useDispatch();

  const handleInitializeCart = () => {
    cartDispatch(clearCart());
    modalDispatch(closeModal());
  }
  const handleCloseModal = () => {
    modalDispatch(closeModal());
  }
  
  return (
    <>
      {
        isOpen && 
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm'>
          <div className='w-[320px] rounded-xl bg-white p-8 shadow-xl'>
            <h2 className='mb-8 text-center text-xl font-bold'>정말 삭제하시겠습니까?</h2>
            <div className='flex justify-center gap-4'>
              <button className="rounded-md bg-red-500 px-6 py-3 text-lg font-medium text-white" onClick={handleInitializeCart}>네</button>
              <button  className='rounded-md bg-gray-200 px-6 py-3 text-lg font-medium' onClick={handleCloseModal}>아니요</button>
            </div>
          </div>
        </div>
      }
    </>
    
  )
}

export default Modal