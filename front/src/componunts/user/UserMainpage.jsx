import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AxiosApi from "../../servies/AxiosApi";
import RightAside from "../layout/RightAside";
import ViewChoice from "../layout/ViewChoice";

function UserMainpage() {
  const [user, setUser] = useState([]); //불러올 데이터
  const [isUserMainPage,setIsUserMainPage]= useState(true);

  const rightaside = { maxwidth: 300 };
  const navigate = useNavigate();
  const UserEditHandle = () => {
    setIsUserMainPage(true);
    navigate("/Useredit");
  };
  //데이터 로드 함수
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
    <div className="UserFrame">
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
                  <button className="editProfileBtn" onClick={UserEditHandle}>
                    프로필 수정
                  </button>
                </div>

                <div className="SecondLayer">
                  <div className="postCount">게시물:{user.postCount}개</div>
                  <div className="followerCount">
                    팔로우{user.followerCount}
                  </div>
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
        </div>
        <div className="ViewChoiceArea">
          <ViewChoice />
        </div>
      </div>

      <div id="rightAside">{rightaside && <RightAside />}</div>
    </div>
  );
}

export default UserMainpage;
