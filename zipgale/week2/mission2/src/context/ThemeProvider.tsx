import { useContext, useState, createContext, type PropsWithChildren, Children } from "react";

export enum THEME {
  LIGHT = 'LIGHT',
  DARK = 'DARK'
}

type TTHEME = THEME.LIGHT | THEME.DARK;

interface IThemeContext {
  theme: TTHEME
  toggleTheme : () => void;
}
export const ThemeContext = createContext<IThemeContext | undefined>(undefined);

export const ThemeProvider = ({children} : PropsWithChildren) => {
  const [theme, setTheme] = useState<TTHEME>(THEME.LIGHT);

  const toggleTheme = () => {
    setTheme((prevTheme) => 
      prevTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT
    );
  };
  return(
    <ThemeContext.Provider value = {{theme, toggleTheme: toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext); 
  if(!context){
    throw new Error('useTheme는 provider 안에서 작성해야 합니다.')
  }
  return context;
}