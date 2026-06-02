import './App.css';
import { HamburgerButton } from './components/HamburgerButton';
import { Sidebar } from './components/Sidebar';
import { useSidebar } from './hooks/useSidebar';

function App() {
  const { isOpen, toggle, close } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-start h-16 gap-4">
            <HamburgerButton isOpen={isOpen} onClick={toggle} />
            <h1 className="text-xl font-bold text-gray-900">돌려돌려 LP판</h1>
          </div>
        </div>
      </header>
      <Sidebar isOpen={isOpen} onClose={close} />
    </div>
  );
}

export default App;
