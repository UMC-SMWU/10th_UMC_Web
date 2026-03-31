import { useState } from 'react'; // [ ] 상태 관리를 위해 추가
import './App.css';

function App() {
  // 1. 현재 언어 상태 (초기값: 'KO')
  const [lang, setLang] = useState<'KO' | 'EN'>('KO');

  // 2. 언어별 텍스트 데이터
  const translations = {
    KO: {
      menu1: '고양이 친구들',
      menu2: '패치 노트',
      download: '앱 다운로드',
      langLabel: '언어',
    },
    EN: {
      menu1: 'Cat Friends',
      menu2: 'Patch Notes',
      download: 'Download App', // 서빈님이 요청하신 문구!
      langLabel: 'Language',
    },
  };

  // 현재 선택된 언어의 데이터 가져오기
  const t = translations[lang];

  return (
    <div className="header-container">
      <nav className="nav-bar">
        {/* 로고 영역 */}
        <div className="nav-bar__logo">
          <div className="logo-icon">🐱</div>
          <span className="logo-text">Aido</span>
        </div>

        {/* 중간: 메뉴 영역 (상태에 따라 글자가 바뀜!) */}
        <ul className="nav-bar__menu">
          <li>{t.menu1}</li>
          <li>{t.menu2}</li>
          <li className="active">{t.download}</li>
        </ul>

        {/* 오른쪽: 언어 선택 영역 */}
        <div className="nav-bar__lang">
          <span className="lang-label">{t.langLabel}</span>
          <div className="lang-switch">
            {/* KO 버튼 클릭 시 setLang('KO') 실행 */}
            <button
              className={`lang-btn ${lang === 'KO' ? 'active' : ''}`}
              onClick={() => setLang('KO')}
            >
              KO
            </button>
            {/* EN 버튼 클릭 시 setLang('EN') 실행 */}
            <button
              className={`lang-btn ${lang === 'EN' ? 'active' : ''}`}
              onClick={() => setLang('EN')}
            >
              EN
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default App;
