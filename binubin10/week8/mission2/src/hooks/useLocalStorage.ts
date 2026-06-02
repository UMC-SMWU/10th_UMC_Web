export const useLocalStorage = (key: string) => {
  const setItem = (value: unknown) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };
  const getItem = () => {
    const value = localStorage.getItem(key);
    if (!value) return null;

    try {
      return JSON.parse(value);
    } catch (error) {
      return value;
    }
  };

  const removeItem = () => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.log(error);
    }
  };
  return { getItem, setItem, removeItem };
};
