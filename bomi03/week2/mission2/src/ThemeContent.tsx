import React from 'react'
import { THEME, useTheme } from './context/ThemeProvider';
import clsx from 'clsx';

const ThemeContent = () => {

    const {theme, toggleTheme } = useTheme();
  
    const isLightMode = theme === THEME.LIGHT;

  return (
    <div className={clsx('p-4 h-dvh w-full', isLightMode ? 'bg-white' : 'bg-gray-800')}
    >
      <h1
        className={clsx(
          'font-bold',
          isLightMode ? 'text-black' : 'text-white'
        )}
      >
        Theme Content
      </h1>
      <p className={clsx('mt-2', isLightMode ? 'text-black' : 'text-white')}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero modi nisi ex ad facilis aperiam possimus minima praesentium repellendus odio veritatis dolores, suscipit aut optio officiis voluptatibus expedita laudantium molestiae!
      </p>
    </div>
  )
}

export default ThemeContent