import React, { useState, useRef, useEffect } from "react";
import AxiosApi from "../../servies/AxiosApi";
import { useLocation } from "react-router-dom";  //쿼리 파라미터 가져올때

function SearchRes() {
  const [items, setItems] = useState([]); //이미지 데이터를 저장
  const [loading, setLoading] = useState(false); //로딩상태
  const loader = useRef(null); //Intersection Observer를 사용할때 사용하는 Ref
  const location = useLocation();

  //새로운 이미지 로드 함수
  const loadMoreItems = async () => {
    if (loading) return; //로딩 중이면 종료

    setLoading(true); //로딩 상태 시작
    try {
      // 백엔드 API에서 JSON 데이터 가져오기
      const response = await AxiosApi.get("/api/gallery");
      const newItems = response.data; // JSON 데이터 받기

      setItems((prevItems) => [...prevItems, ...newItems]); // 기존 아이템에 새로운 아이템 추가
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    }

    setLoading(false); // 로딩 상태 종료
  };

  //URL에서 검색어 추출
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query") || ""; //검색어를 가져오기

  // 전달된 검색 결과 가져오기
  const {filePostList, userList} = location.state?.searchResults || [];

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
  }, [query]); //검색어가 변경될때마다 호출

  // 컴포넌트 마운트 시 처음 데이터 로드
  useEffect(() => {
    loadMoreItems();
  }, [query]); //검색어가 변경될때마다 호출

  return (
    <>
      <div>
        {/* 검색된 사용자 목록 */}
        <div>
          <h2>검색된 사용자</h2>
          {userList.length === 0 ? (
            <p>검색된 사용자가 없습니다.</p>
          ) : (
            <ul>
              {userList.map((user) => (
                <li>
                  <p>{user.username}</p>
                  <p>{user.tag_id}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 검색된 게시글 목록 */}
        <div>
          <h2>검색된 게시글 목록</h2>
          {filePostList.length === 0 ? (
            <p>검색된 게시글이 없습니다.</p>
          ) : (
            <ul>
              {filePostList.map((post) => (
                <li>
                  <img
                    src={`/contentImage/${post.upFileName}`}
                    alt={post.filePath} />
                  <p>{post.content}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 데이터가 없으면 작성된 글이 없습니다. 표시 */}
      {items.length === 0 ? (
        <p style={{ texAlign: "center", marginTop: "20px " }}>
          작성된 글이 없습니다.
        </p>
      ) : (
        <div className="masonry">
          {/* 사진들 출력 */}
          {items.map((item) => (
            <div className={`item height${(item.id % 3) + 1}`} key={item.id}>
              <img
                src={item.image_url}
                alt={item.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ))}
          {/* 로더 위치 */}
          <div
            ref={loader}
            style={{ height: "50%", background: "transparent" }}
          />
        </div>
      )}
      {/* 로딩중 표시 */}
      {loading && <p>로딩 중...</p>}
    </>
  );
}

export default SearchRes;
