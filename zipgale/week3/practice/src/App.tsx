import './App.css'
import { Link, Routes } from './Route';

const HannaPage = () => <h1>해나 페이지</h1>
const AeongPage = () => <h1>애옹 페이지</h1>;
const BarbiePage = () => <h1>바비 페이지</h1>;
const NotFound = () => <h1>Not Found</h1>;

const Header = () => {
  return (
    <nav style = {{ display: 'flex', gap: '10px' }}>
      <Link to="/Hanna">Hanna</Link>
      <Link to="/Aeong">Aeong</Link>
      <Link to="/Barbie">Barbie</Link>
      <Link to ='/NotFound'>Not Found</Link>
    </nav>
  )
}
function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/Hanna" component={HannaPage} />
        <Route path="/Aeong" component={AeongPage} />
        <Route path="/Barbie" component={BarbiePage} />
        <Route path="/NotFound" component={NotFound} />
      </Routes>
    </>
  )
  const { pathname } = window.location;

  switch (pathname) {
    case '/Hanna':
      return <HannaPage />;
    case '/Aeong':
      return <AeongPage />;
    case '/Barbie':
      return <BarbiePage />;
    default:
      return <h1>404</h1>;
  }
}

export default App
