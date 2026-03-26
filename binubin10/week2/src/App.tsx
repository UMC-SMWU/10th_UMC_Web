import './App.css';
// 1) List 컴포넌트를 import 해요.
import List from './components/List';

function App() {
  const nickname = '피노';
  const sweetPotato = '고구마';
  const array = ['REACT', 'NEXT', 'VUE', 'SVELTE', 'ANGULAR', 'REACT-NATIVE'];

  return (
    <>
      <strong className="school">숙명여자대학교</strong>
      <p
        className="user-nickname"
        style={{ color: 'purple', fontWeight: 'bold', fontSize: '3rem' }}
      >
        {nickname}/윤서빈
      </p>
      <h1 className="main-sentence">{`${nickname}는 ${sweetPotato} 아이스크림을 좋아합니다.`}</h1>
      <ul className="stack-list">
        {array.map((yaho, idx) => (
          <List key={idx} tech={yaho} />
        ))}
      </ul>
    </>
  );
}

export default App;
