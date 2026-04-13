import { useState } from "react";

export function useLocalStorage<T>(key:string,initialValue:T) {
    const [storedValue, setStoredValue]=useState<T>(()=> {
        try {
            const item=window.localStorage.getItem(key);
            // console.log(`${key} 읽어오기 시도:`, item);
            return item ? JSON.parse(item) : initialValue;
        }
        catch {
            return initialValue;
        }
    });

    const setValue=(value:T | ((val:T)=>T))=> {
        try {
            const valueToStore=value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);

            // console.log("저장 시도:", key, valueToStore);
            window.localStorage.setItem(key,JSON.stringify(valueToStore));
            // console.log("저장 완료");
        }
        catch (error) {
            console.log(error);
        }
    };

    return [storedValue,setValue] as const;
}