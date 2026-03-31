import './App.css'
// 1) List 컴포넌트를 import
import List from './components/List'

function App() {
  const nickname = '보리'
  const sweetPotato = '고구마'
  const array = ['REACT', 'NEXT', 'VUE', 'SVELTE', 'ANGULAR', 'REACT-NATIVE']
  return (
     <>
      <strong className='school'>숙명여자대학교</strong>
      <p style={{color: 'purple', fontWeight:'bold', fontSize:'3rem'}}>{nickname}/김보미</p>
      <h1>{`${nickname}는 ${sweetPotato} 아이스크림을 좋아합니다.`}</h1>
      <ul>
        {array.map((yaho, idx) => (
           // 2) <li key={idx}>{yaho}</li> -> <List/>로 교체
           <List key={idx} tech="REACT" /> // "REACT"라면 "고구마와 함께하는 리액트"로 출력, 아니라면 그냥 기술 이름 그대로 출력
        ))}
      </ul>
     </>
  )
}

export default App