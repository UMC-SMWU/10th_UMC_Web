//로컬 스토리지를 활용 시 사용하는 훅 
export const useLocalStorage = (key: string) => {
  const setItem = (value: unknown) => { //localstorage에 저장
    try{
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch(error){
      console.log(error)
    }
  };

  const getItem = () => { // 받아오기
    try{
      const item = window.localStorage.getItem(key);

      return item ? JSON.parse(item) : null
    } catch(error){
      console.log(error)
    }
  };

  const removeItem = () => { // 제거
    try {
      window.localStorage.removeItem(key);
    } catch(error){
      console.log(error)
    }
  };

  return {setItem, getItem, removeItem}
}