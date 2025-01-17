import React, { useState, useRef, useEffect } from "react";
import AxiosApi from "../../servies/AxiosApi";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

function SearchRes() {
  const [items, setItems] = useState([]); // 이미지 데이터를 저장
  const [loading, setLoading] = useState(false); // 로딩 상태
  const loader = useRef(null); // Intersection Observer를 사용할 때 사용하는 Ref
  const location = useLocation();

  // URL에서 검색어 추출
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query") || ""; // 검색어를 가져오기

  // 전달된 검색 결과 가져오기
  const { filePostList = [], userList = [] } =
    location.state?.searchResults || {};

  // 새로운 이미지 로드 함수
  const loadMoreItems = async () => {
    if (loading) return; // 로딩 중이면 종료

    setLoading(true); // 로딩 상태 시작
    try {
      // 백엔드 API에서 JSON 데이터 가져오기
      const response = await AxiosApi.get("/user/info", {
        params: { query }, // 검색어를 API에 전달
      });
      const newItems = Array.isArray(response.data) ? response.data : []; // 배열 확인

      setItems((prevItems) => [...prevItems, ...newItems]); // 기존 아이템에 새로운 아이템 추가
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    }

    setLoading(false); // 로딩 상태 종료
  };

  // Intersection Observer 설정 (스크롤 끝에 도달하면 새로운 데이터 로드)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreItems(); // 무한 스크롤 로직
        }
      },
      { threshold: 1.0 } // 요소가 100% 화면에 나타날 때 트리거
    );

    if (loader.current) {
      observer.observe(loader.current); // 로더를 감지하도록 설정
    }

    return () => {
      if (loader.current) observer.unobserve(loader.current); // 컴포넌트 언마운트 시 해제
    };
  }, [query]); // 검색어가 변경될 때마다 호출

  // 컴포넌트 마운트 시 처음 데이터 로드
  useEffect(() => {
    loadMoreItems();
  }, [query]); // 검색어가 변경될 때마다 호출

  const navigate = useNavigate();

  const handleDetails = (event, linkId) => {
    event.preventDefault();
    navigate("/DetailsPage", { state: { linkId } }); // linkId를 state로 전달
  };

  return (
    <div className="searChview">
      <div>
        {/* 검색된 사용자 목록 */}
        <div className="userSearChArea">
          <div
            style={{
              display: "flex",
              overflowX: "auto", // 좌우 스크롤 가능하게 설정
              gap: "10px",
              padding: "10px",
            }}
          >
            {userList.length === 0 ? (
              <p>검색된 사용자가 없습니다.</p>
            ) : (
              userList.map((user) => (
                <div
                  className="User"
                  onClick={
                    (event) => {
                      console.log("::::::::::::::::::::::");
                      console.log(user);
                      console.log("::::::::::::::::::::::");
                      handleDetails(event, user.linkId);
                    } // linkId를 전달
                  }
                  key={user.username}
                >
                  {/* 프로필 사진 */}
                  {user.profileImageUrl ? (
                    <img
                      src={`/profileImage/${user.up_filename}`}
                      alt={`${user?.username} 이미지`}
                      className="userProfilePhoto"
                    />
                  ) : (
                    <img
                      src="/profileImage/default-profile.png"
                      alt="기본 프로필"
                      className="userProfilePhoto"
                    />
                  )}
                  <div className="userNickArea">
                    <p className="userNick">{user.username}</p>
                    <p className="userNick">{user.tag_id}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 검색된 게시글 목록 */}
        <div className="postSearChArea">
          <div className="GridArea">
            {filePostList.length === 0 ? (
              <p>검색된 게시글이 없습니다.</p>
            ) : (
              filePostList.map((user) => (
                <div
                  key={user.id}
                  onClick={(event) => handleDetails(event, user.linkId)} //게시물의 ID를 linkId로 전달
                >
                  <img
                    className="postViewArea"
                    src={`/contentImage/${user.up_fileName}`}
                    alt="게시글 이미지"
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 로딩중 표시 */}
      {loading && <p>로딩 중...</p>}
    </div>
  );
}

export default SearchRes;
