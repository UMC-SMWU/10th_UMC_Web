import { Routes } from './router/Routes';
import { Route } from './router/Route';
import { Link } from './router/Link';

const Home = () => <h1>홈 페이지</h1>;
const About = () => <h1>소개 페이지</h1>;

function App() {
  return (
    <Routes>
      <nav>
        <Link to="/">홈으로</Link> | <Link to="/about">소개로</Link>
      </nav>

      <hr />

      <Route path="/" component={<Home />} />
      <Route path="/about" component={<About />} />
    </Routes>
  );
}

export default App;