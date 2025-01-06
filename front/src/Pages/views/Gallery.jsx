import React, { useState, useRef, useEffect } from "react";
import AxiosApi from "../../servies/AxiosApi";

function Gallery() {
  const [items, setItems] = useState([]); // 이미지 데이터를 저장
  const [loading, setLoading] = useState(false); // 로딩 상태
  const loader = useRef(null); // Intersection Observer를 사용할 때 사용할 ref

  // 새로운 이미지를 로드하는 함수
  const loadMoreItems = async () => {
    if (loading) return; // 이미 로딩 중이면 종료

    setLoading(true); // 로딩 상태 시작

    try {
      // 백엔드 API에서 JSON 데이터 가져오기
      const response = await AxiosApi.get("/auth/gallery");
      const newItems = response.data; // JSON 데이터 받기

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
  }, []);

  // 컴포넌트 마운트 시 처음 데이터 로드
  useEffect(() => {
    loadMoreItems();
  }, []);

  return (
    <>
      {/* 데이터가 없으면 "작성된 글이 없습니다." 텍스트 표시 */}
      {items.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          작성된 글이 없습니다.
        </p>
      ) : (
        <div className="masonry">
          {/* 사진들 출력 */}
          {items.map((item) => (
            <div className={`item height${(item.id % 3) + 1}`} key={item.id}>
              <img
                src={item.image_url} // 이미지 URL을 JSON에서 가져옴
                alt={item.title} // 이미지 제목을 JSON에서 가져옴
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ))}
          {/* 로더 위치 */}
          <div
            ref={loader}
            style={{ height: "50px", background: "transparent" }}
          />
        </div>
      )}
      {/* 로딩 중 표시 */}
      {loading && <p>로딩 중...</p>}
    </>
  );
}

export default Gallery;
