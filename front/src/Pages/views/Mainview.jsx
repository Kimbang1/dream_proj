import React, { useState, useEffect } from "react";

import ViewChoice from "../../componunts/layout/ViewChoice";
import AxiosApi from "../../servies/AxiosApi";

function Mainview({ setIsMainPage }) {
  const [user, setUser] = useState([]); //불러올 데이터
  // const [currentPage, setCurrentPage] = useState("gallery"); // 현재 페이지를 관리하는 상태
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosApi.get("/post/galleryView"); //실제 API엔트포인트로 바꿔야함.
        setUser(response.data);
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (typeof setIsMainPage === "function") {
      setIsMainPage(true); // 함수인지 확인 후 호출
    }
  }, [setIsMainPage]);
  return (
    <>
      {/* //프로필 페이지가 아닐때만 렌더링 */}
      <div className="ChoiceBtn">
        <ViewChoice setIsMainPage={true} />
      </div>
    </>
  );
}

export default Mainview;
