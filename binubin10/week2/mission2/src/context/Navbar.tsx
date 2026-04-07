import clsx from 'clsx';
import { THEME, useTheme } from './ThemeProvider';
import ThemeToggleButton from './ThemeToggleButton';

export default function Navbar() {
  const { theme } = useTheme();

  const isLightMode = theme === THEME.LIGHT;

  return (
    <nav
      className={clsx(
        'p-4 w-full flex justify-end',
        isLightMode ? 'bg-white' : 'bg-gray-800 text-white',
      )}
    >
      <ThemeToggleButton />
    </nav>
  );
}
