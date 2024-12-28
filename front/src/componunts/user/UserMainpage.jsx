import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserGallery from "./UserGallery";
import UserPost from "./UserPost";
import axios from "axios";

function UserMainpage() {
  const [user, setUser] = useState([]); //불러올 데이터
  const [isPosthome, setIsPosthome] = useState(true);
  const [isGalleryhome, setIsGalleryhome] = useState(false);
  console.log(isGalleryhome, isPosthome);

  const onPostClick = () => {
    setIsPosthome(false);
    setIsGalleryhome(true);
  };

  const onGalleryClick = () => {
    setIsPosthome(true);
    setIsGalleryhome(false);
  };
  const navigate = useNavigate();

  //데이터 로드 함수
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/user/data"); //실제 API엔트포인트로 바꿔야함.
        setUser(response.data);
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      }
    };
    fetchData();
  }, []);
  const handlePostClick = () => {
    navigate("/user/post");
  };

  const handleUserGalleryClick = () => {
    navigate("/user/gallery");
  };

  return (
    <div className="userpage">
      <div className="viewChoiceBtn_view">
        {/* 프로필화면 상단 */}

        <div className="ProfileArea">
          <div className="PrImgArea">
            <img src="/images/cat.jpg" alt="고양이 이미지" />
          </div>

          <div className="InfoArea">
            <div className="useDetails">
              
              <div className="FirstLayer">
                <div className="userName">@tagid{user.userName}</div>
                <button
                  className="editProfileBtn"
                  onClick={() => navigate("/user/Useredit")}
                >
                  프로필 수정
                </button>
              </div>

              <div className="SecondLayer">
                <div className="postCount">게시물:{user.postCount}개</div>
                <div className="followerCount">팔로우{user.followerCount}</div>
                <div className="followingCount">
                  팔로워{user.followingCount}
                </div>
              </div>

              <div className="ThirdLayer">
                <div className="userName">유저 이름{user.userName}</div>
                <div className="userContent">유저 소개글{user.Content}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 버튼 영역 (공통) */}

        <div className="BtnAreaChoice">
          <button className="choice" onClick={onPostClick}>
            <img
              onClick={onPostClick}
              className="Btnicon"
              src="/images/PostHome.png"
              alt="포스트 홈"
            />
          </button>

          <button className="choice" onClick={onGalleryClick}>
            <img
              onClick={onGalleryClick}
              className="Btnicon"
              src="/images/GarrelyHome.png"
              alt="갤러리 홈"
            />
          </button>
        </div>

        {/* 뷰 영역 */}
        <div id="ViewArea">
          {/* 포스트/갤러리 누르는 것에 따른 화면 전환 */}
          {isPosthome && <UserPost />}
          {isPosthome && <UserGallery />}
        </div>
      </div>

      {/* 오른쪽 사이드바 */}
      <div className="rightAside">
        <div className="Frame"></div>
      </div>
    </div>
  );
}

export default UserMainpage;
