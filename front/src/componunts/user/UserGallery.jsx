import React, { useState, useRef, useEffect } from "react";
import AxiosApi from "../../servies/AxiosApi";


function UserGallery() {
    
  const [items, setItems] = useState([]); // 초기 데이터는 빈 배열로 설정
  const loader = useRef(null); // Intersection Observer를 위한 ref
  const [page, setPage] = useState(1); // 페이지 번호 상태
  const [loading, setLoading] = useState(false); // 로딩 상태
  
  // API 호출을 통해 데이터를 가져오는 함수
  const fetchGalleryItems = async () => {
    if (loading) return;  // 이미 로딩 중이면 중복 호출 방지

    setLoading(true);
    try {
      // 백엔드 API 호출 (페이지 기반 데이터를 가져온다고 가정)
      const response = await AxiosApi.get("/contents/userGalleryView");
      const newItems = response.data; // 서버에서 반환된 데이터

      // 기존 데이터와 새 데이터를 병합
      setItems((prevItems) => [...prevItems, ...newItems]);

      // 페이지 번호 증가
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("데이터 로드 실패: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Intersection Observer 설정
  useEffect(() => {
    if(!loader.current) return;

    const currentLoder = loader.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if(entries[0].isIntersecting) {
          fetchGalleryItems(); // 스크롤 끝에 도달하면 데이터 로드
        }
      },
      { threshold: 1.0}
    );

    observer.observe(currentLoder);

    return () => {
      if(currentLoder) observer.unobserve(currentLoder);
    };
  }, [loader.current]);

  // 컴포넌트 초기 렌더링 시 첫 데이터 로드
  useEffect(() => {
    fetchGalleryItems();
  }, []);

  return (
    <div className="userGalleryView">
      {/* 사진이 없으면 로딩 메시지를 표시 */}
      {items.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          작성된 글이 없습니다.
        </p>
      ) : (
        <div className="masonry">
          {items.map((item, index) => (
            <div className={`item ${item.heightClass}`} key={index}>
              <img
                src={item.filePath}
                alt={item.fileName}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ))}
          <div
            ref={loader}
            style={{ height: "50px", background: "transparent" }}
          />
        </div>
      )}
    </div>
  );
}

export default UserGallery;
