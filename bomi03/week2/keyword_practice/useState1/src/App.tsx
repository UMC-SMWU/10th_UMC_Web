// import './App.css'
// import { useState } from 'react';

// function App() {
//   const [count, setCount] = useState(0)  // TypeScript에서는 useState에 타입을 명시하지 않아도, 초기값을 보고 자동으로 타입을 추론 (count->number로 추론됨)
//                                          // 하지만, 초기값이 null이나 undefined라면, 타입을 제대로 추론하지 못할 수 있으므로 => 제네릭 명시
//   const handleIncreaseNumber = () => {
//     setCount(count + 1)
//   }

//   return (
//      <>
//       <h1>{count}</h1>
//       <button onClick={handleIncreaseNumber}>숫자 증가</button>
//      </>
//   )
// }

// export default App


// // 아래와 같이 코드를 작성하면 버튼을 눌렀을 때, 6씩 증가할 것 같지만 실제로는 1만 증가
// // React는 상태를 즉시 업데이트하지 않고 함수가 실행될 당시의 상태(count)를 기억해두고 그 값으로 계산하기 때문
// import './App.css'
// import { useState } from 'react';

// function App() {
//   const [count, setCount] = useState(0)

//   const handleIncreaseNumber = () => {
//     setCount(count + 1)
//     setCount(count + 1)
//     setCount(count + 1)
//     setCount(count + 1)
//     setCount(count + 1)
//     setCount(count + 1)
//   }

//   return (
//      <>
//       <h1>{count}</h1>
//       <button onClick={handleIncreaseNumber}>숫자 증가</button>
//      </>
//   )
// }

// export default App


// // 실제로 버튼을 한 번 누를 때마다 6씩 증가하는 코드
// import './App.css'
// import { useState } from 'react';

// function App() {
//   const [count, setCount] = useState(0)

//   const handleIncreaseNumber = () => {
//     setCount(prev => prev + 1)
//     setCount(prev => prev + 1)
//     setCount(prev => prev + 1)
//     setCount(prev => prev + 1)
//     setCount(prev => prev + 1)
//     setCount(prev => prev + 1)
//   }

//   return (
//      <>
//       <h1>{count}</h1>
//       <button onClick={handleIncreaseNumber}>숫자 증가</button>
//      </>
//   )
// }

// export default App


// useState로 객체 업데이트하기
import { useState } from 'react';

function App() {
  // 초기 상태: name, age, nickname, city를 가진 객체
  const [person, setPerson] = useState({
    name: '김보미',
    age: 24,
    nickname: '보리',
    city: '', // city 키를 미리 넣어둬야 타입이 추론됨
  });

  // city 업데이트
  const updateCity = () => {
    setPerson((prevPerson) => ({
      ...prevPerson,   // 기존 상태 복사
      city: '서울',    // city 값만 덮어쓰기
    }));
  };

  // age 1 증가
  const increaseAge = () => {
    setPerson((prevPerson) => ({
      ...prevPerson,           // 기존 상태 복사
      age: prevPerson.age + 1, // age만 +1
    }));
  };

  return (
    <>
      <h1>이름: {person.name}</h1>
      <h2>나이: {person.age}</h2>
      <h3>닉네임: {person.nickname}</h3>
      {person.city && <h4>도시: {person.city}</h4>}
      <button onClick={updateCity}>도시 추가</button>
      <button onClick={increaseAge}>나이 증가</button>
    </>
  );
}

export default App;