import clsx from 'clsx';
import { THEME, useTheme } from './ThemeProvider';

export default function ThemeContent() {
  const { theme } = useTheme();
  const isLightMode = theme === THEME.LIGHT;

  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center h-screen w-full transition-all duration-500',
        isLightMode ? 'bg-white' : 'bg-[#1a1c2c]',
      )}
    >
      <h1
        className={clsx(
          'text-6xl font-bold mb-4',
          isLightMode ? 'text-black' : 'text-white',
        )}
      >
        Theme Content
      </h1>
      <p
        className={clsx(
          'max-w-2xl text-center text-lg px-4',
          isLightMode ? 'text-gray-600' : 'text-gray-300',
        )}
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores placeat
        dolorum magnam magni facere vel sequi itaque obcaecati...
      </p>
    </div>
  );
}
