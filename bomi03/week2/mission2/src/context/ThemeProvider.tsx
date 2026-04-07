import { createContext, useContext, useState, type PropsWithChildren } from 'react';

export enum THEME {
    LIGHT = 'LIGHT',
    DARK = 'DARK',
}

type TTHEME = THEME.LIGHT | THEME.DARK;

interface IThemeContext {
    theme: TTHEME;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<IThemeContext | undefined>(undefined);

export const ThemeProvider = ({children}: PropsWithChildren) => {
    const [theme, setTheme] = useState<TTHEME>(THEME.LIGHT);

    const toggleTheme = () : void => {
        setTheme((prevTheme) : THEME => prevTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT);
    };

    return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () : IThemeContext => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
}