import React from "react";
import AxiosApi from "../../servies/AxiosApi";
import { useMediaQuery } from "react-responsive";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

function Leftaside() {
  const hiddenAside = useMediaQuery({ maxWidth: 750 });
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);

  const handleLogout = async () => {
    //로그아웃시 쿠키 삭제
    if (window.confirm("로그아웃 하시겠습니까?")) {
      removeCookie("accessToken", { path: "/", domain: "your-domain.com" });
      removeCookie("refreshToken", { path: "/", domain: "your-domain.com" });
      try {
        await AxiosApi.post("/auth/logout", {}, { withCredentials: true }); //로그아웃
        // 쿠키 삭제 후 확인
        if (!cookies.accessToken) {
          console.log("쿠키 삭제 성공");
        } else {
          console.log("쿠키 삭제 실패");
        }
        //로그아웃 성공시 랜딩 페이지로 아래껄 주석 지우고 활성화 시켜주세용
        window.location.href = "/";
      } catch (error) {
        console.log("로그아웃 실패:", error);
      }
    }
  };

  const navigate = useNavigate();

  const handlehomeClick = () => {
    console.log("메인");
    navigate("/Mainview");
  };

  const handleUseMainClick = () => {
    console.log("메인페이지");
    navigate("/user/UserMainpage");
  };

  const handleMapClick = () => {
    console.log("지도");
    navigate("/Map");
  };

  const handleUserList = () => {
    console.log("회원페이지 관리자 전용");
    navigate("/UserList");
  };

  const handelGalleryList = () => {
    console.log("게시물리스트 관리자 전용");
    navigate("/GalleryList");
  };

  return (
    <div className="wrap">
      {!hiddenAside && (
        <div>
          <div className="LogoArea">
            <img onClick={handlehomeClick} src="/images/logo4.png" alt="로고" />
          </div>

          <div className="gnbArea">
            <div className="menu">
              <img onClick={handlehomeClick} src="/images/home.png" alt="홈" />
            </div>

            <div className="menu">
              <img onClick={handleMapClick} src="/images/map.png" alt="지도" />
            </div>

            <div className="menu">
              <img src="/images/chating.png" alt="채팅" />
            </div>

            <div className="menu">
              <img src="/images/whale.png" alt="챗봇" />
            </div>

            <div className="menu">
              <img
                onClick={handleUseMainClick}
                src="/images/cat.jpg"
                alt="프로필"
              />
            </div>

            <div className="menu">
              <button onClick={handleLogout}>로그아웃</button>
            </div>

            <div className="Manager">
              <div className="menu" onClick={handleUserList}>
                <span>회원목록</span>
              </div>

              <div className="menu" onClick={handelGalleryList}>
                <span>게시글 목록</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Leftaside;
