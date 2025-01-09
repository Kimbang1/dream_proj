import React, { useEffect, useState } from "react";
import AppRouter from "./router/AppRouter"; // 라우터를 가져옴
import "./style/Style.css"; // 글로벌 스타일 적용
// import AxiosApi from "../src/servies/AxiosApi";
function App() {
  //환경변수 가져오기
  const apiBaseUrl = process.env.REACT_APP_BASE_URL;
  // const [uuid, setUuid] = useState(null);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await AxiosApi.get("/user/uuid");
  //       setUuid(response.data.uuid);
  //     } catch (error) {
  //       console.error("유유아이디 가져와야지 왜 못가지고와!:", error);
  //     }
  //   };
  // },[]);

  console.log("apiBaseUrl:", apiBaseUrl);
  return (
    <div>
      <AppRouter /> {/* App의 주요 라우터 */}
    </div>
  );
}

export default App;
