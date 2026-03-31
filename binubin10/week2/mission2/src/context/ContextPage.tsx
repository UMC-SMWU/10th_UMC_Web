import { ThemeProvider } from './ThemeProvider';
import Navbar from './Navbar';
import ThemeContent from './ThemeContent';

export default function ContextPage() {
  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen w-full">
        <Navbar />

        <main className="flex-1 flex flex-col items-center justify-center">
          <ThemeContent />
        </main>
      </div>
    </ThemeProvider>
  );
}
