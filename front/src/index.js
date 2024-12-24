import React from "react";
import ReactDOM from "react-dom/client"; // React 18 사용
import App from "./App"; // App 컴포넌트 불러오기

const root = ReactDOM.createRoot(document.getElementById("root")); // root DOM을 초기화
root.render(
  <React.StrictMode>
    <App /> {/* App 컴포넌트를 렌더링 */}
  </React.StrictMode>
);
