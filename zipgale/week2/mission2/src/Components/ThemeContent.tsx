import React from 'react'
import { useTheme, THEME } from '../context/ThemeProvider';
import clsx from 'clsx';

const ThemeContent = () => {
  const { theme, toggleTheme } = useTheme();
    
  const isLightMode = theme === THEME.LIGHT;
  return(
    <div className={clsx(
      'p-4 h-dvh',
      isLightMode ? 'bg-white' : 'bg-gray-800'
    )}>
      <h1 className={clsx(
        'text-2xl font-bold',
        isLightMode ? 'text-black' : 'text-white'
      )}>Theme Content
      </h1>
      <p className={clsx(
        'mt-2',
        isLightMode ? 'text-black' : 'text-white'
      )}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum quaerat magni numquam voluptates est natus? Maxime possimus recusandae repellendus saepe perferendis nesciunt itaque at dolore iste temporibus, tenetur error nam!
      </p>
    </div>
  )
}
export default ThemeContent;