import React, { useEffect, useState } from "react";
import AxiosApi from "../../servies/AxiosApi";
import { useMediaQuery } from "react-responsive";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Managerbutton from "../../Pages/AdminPage/Managerbutton";

function Leftaside() {
  const [openAdmin, setOpenAdmin] = useState(false);

  const hiddenAside = useMediaQuery({ maxWidth: 750 });
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const [user, setUser] = useState({
    profile_image: "", // 초기 상태
    user: {
      uuid: "",
    },
  });

  //관리자 구분값이 왔으때 관리자 버튼 나오게
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await AxiosApi.get("/user/leftBar");

        // 관리자인지 확인하는 조건
        if (response.data.user.is_admin) {
          console.log("관리자인지:", response.data.user.is_admin);
          setOpenAdmin(true);
        } else {
          setOpenAdmin(false);
        }
      } catch (error) {
        console.error("관리자 여부 확인 실패:", error);
        setOpenAdmin(false); // 에러 발생 시 기본값으로 관리자 버튼 숨김 처리
      }
    };

    checkAdmin();
  }, []);

  // 이미지 불러오는 데이터 로드 함수
  useEffect(() => {
    const userProfile = async () => {
      try {
        const response = await AxiosApi.get("/user/leftBar"); // API 요청
        console.log("API 응답 데이터:", response.data); // 응답 데이터 확인

        // profile_image 값 확인
        if (response.data.profile_image) {
          setUser(response.data); // 데이터 업데이트
        } else {
          console.warn("프로필 이미지가 비어 있습니다.");
          setUser({ profile_image: "defaultProfile.png" }); // 기본 이미지 설정
        }
      } catch (error) {
        console.error("프로필사진을 가져오지 못했습니다.", error);
        setUser({ profile_image: "defaultProfile.png" }); // 에러 발생 시 기본 이미지 설정
      }
    };

    userProfile();
  }, []);

  const handleLogout = async () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      removeCookie("accessToken", { path: "/", domain: "your-domain.com" });
      removeCookie("refreshToken", { path: "/", domain: "your-domain.com" });
      try {
        await AxiosApi.post("/auth/logout", {}, { withCredentials: true });
        window.location.href = "/";
      } catch (error) {
        console.log("로그아웃 실패:", error);
      }
    }
  };

  const navigate = useNavigate();

  const handleUserDetails = (event, uuid) => {
    event.preventDefault();
    console.log("UUID 전달 확인:", uuid, "Type:", typeof uuid);
    console.log("uuid: ", uuid);
    navigate("/user/UserMainpage", { state: { uuid } }); // linkId를 state로 전달
  };

  return (
    <div className="wrap">
      {!hiddenAside && (
        <div>
          <div className="LogoArea">
            <img
              onClick={() => navigate("/Mainview")}
              src="/images/logo4.png"
              alt="로고"
            />
          </div>
          <div className="gnbArea">
            <div className="menu">
              <img
                onClick={() => navigate("/Mainview")}
                src="/images/home.png"
                alt="홈"
              />
            </div>
            <div className="menu">
              <img
                onClick={() => {
                  console.log("지도 아이콘 클릭됨");
                  navigate("/Map");
                }}
                src="/images/map.png"
                alt="지도"
              />
            </div>
            <div className="menu">
              <img src="/images/chating.png" alt="채팅"
              onClick={()=>{
                console.log("채팅방 이동");
                navigate("/ChatingList");
              }}
              />
            </div>
            <div className="menu">
              <img src="/images/whale.png" alt="챗봇" />
            </div>
            <div className="menu">
              <img
                onClick={(event) => {
                  if (user && user.user.uuid) {
                    handleUserDetails(event, user.user.uuid);
                  } else {
                    console.warn("유효한 사용자 정보가 없습니다.");
                  }
                }}
                key={user?.user.uuid} // user가 undefined일 경우를 대비한 옵셔널 체이닝
                src={
                  user.profile_image
                    ? `/profileImage/${user.profile_image}`
                    : {/*"/profileImage/defaultProfile.png"*/}
                }
                alt="프로필"
              />
            </div>
            <div className="menu">
              <button onClick={handleLogout}>로그아웃</button>
            </div>

            {/* 관리자 일시에만 보이기 */}
            {openAdmin && <Managerbutton />}
          </div>
        </div>
      )}
    </div>
  );
}

export default Leftaside;
