import React, {useState, useEffect} from "react";
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
  //       setUuid(response.data.uuid); // 백엔드에서 받은 uuid
  //     } catch (error) {
  //       console.error("데이터 가져오기 실패:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  console.log("apiBaseUrl:", apiBaseUrl);
  return (
    <div>
      <AppRouter /> {/* App의 주요 라우터 */}
    </div>
  );
}

export default App;
