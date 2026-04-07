import ContextPage from './context/ContextPage';
import './App.css';
import { ThemeProvider } from './context/ThemeProvider';

export default function App() {
  return (
    <ThemeProvider>
      <ContextPage />
    </ThemeProvider>
  );
}
