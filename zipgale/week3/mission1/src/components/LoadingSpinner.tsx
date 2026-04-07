export const LoadingSpinner = () => {
  return ( 
    <div className = 'size-12 animate-spin rounded-full border-6 border-t-transparent border-[#b2dab1]' //  size-12 - w-12 h-12 
     role='status'> 
      <span className='sr-only'>Loading...</span>
    </div>
  )
}