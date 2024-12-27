import React from "react";
import AppRouter from "./router/AppRouter"; // 라우터를 가져옴
import "./style/Style.css"; // 글로벌 스타일 적용

function App() {
  //환경변수 가져오기
  const apiBaseUrl = process.env.REACT_APP_BASE_URL;


  console.log("apiBaseUrl:", apiBaseUrl);
  return (
    <div>
      <AppRouter /> {/* App의 주요 라우터 */}
    </div>
  );
}

export default App;
