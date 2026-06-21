import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MovieSearchPage from './pages/MovieSearchPage';
import MovieDetailPage from './pages/MovieDetailPage';

const router = createBrowserRouter([
  {
    path:"/",
    element:<MovieSearchPage />,
  },
  {
    path:"/:id",
    element:<MovieDetailPage />,
  }
])

function App() {
  return (
    <div className='App'>
      <RouterProvider router={router} />
    </div>
  )
}

export default App;
