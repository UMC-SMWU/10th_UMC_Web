import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TodoList } from "./components/TodoList";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TodoList />
      <ReactQueryDevtools
        initialIsOpen={false} // 시작 시 패널 열림 여부
        buttonPosition="bottom-right" // 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'relative'
        position="bottom" // 'top' | 'bottom' | 'left' | 'right'
      />
    </QueryClientProvider>
  );
};

export default App;
