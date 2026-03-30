import { createContext, useContext, useState, type PropsWithChildren } from "react";

export enum THEME {
    LIGHT = 'LIGHT',
    DARK = 'DARK',
}

type TTheme = THEME.LIGHT | THEME.DARK;

interface IThemeContext {
    theme: TTheme;
    toggleTheme: () => void;
}


export const ThemeContext = createContext<IThemeContext | undefined>(undefined);

export const ThemeProvider = ({children}: PropsWithChildren) => {
    const [theme, setTheme] = useState<TTheme>(THEME.LIGHT);

    const toggleTheme = () => {
        setTheme((prevTheme) => 
            prevTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT // 현재 테마가 라이트면 다크로, 다크면 라이트로 바꿔라
        );
    };
    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
};