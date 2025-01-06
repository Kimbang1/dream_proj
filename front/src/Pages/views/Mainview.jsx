import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 임포트
import Gallery from "../../Pages/views/Gallery"; // Gallery 컴포넌트 임포트
import RightAside from "../../componunts/layout/RightAside";
import ViewChoice from "../../componunts/layout/ViewChoice";
import AxiosApi from "../../servies/AxiosApi";

function Mainview(isMainPage) {
  const [user, setUser] = useState([]); //불러올 데이터
  // const [currentPage, setCurrentPage] = useState("gallery"); // 현재 페이지를 관리하는 상태
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosApi.get("/post/data"); //실제 API엔트포인트로 바꿔야함.
        setUser(response.data);
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {/* //프로필 페이지가 아닐때만 렌더링 */}
      <div className="ChoiceBtn">
        <ViewChoice />
      </div>
      <div className="RightAside">
        <RightAside />
      </div>
      <div className="viewArea">{!isMainPage && <Gallery />}</div>
    </>
  );
}

export default Mainview;
