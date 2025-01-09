import React, { useState, useRef, useEffect } from "react";
// import axios from "axios"; // axios를 사용해 API 호출
import ApiAxios from "../../servies/AxiosApi";
function UserGallery() {
  // // 상태 변수 `items`: 초기 데이터를 관리하며, 화면에 표시할 항목들을 저장
  // const [items, setItems] = useState(
  //   Array.from({ length: 10 }, (_, i) => ({
  //     src: `${i + 1}.jpg`, // 이미지 URL
  //     heightClass: `height${(i % 3) + 1}`, // 3개의 높이 클래스 중 하나
  //   }))
  // );
  
  // // `loader`: DOM 참조를 위한 useRef 객체
  // const loader = useRef(null);
  
  // // `loadMoreItems` 함수: 현재 `items` 상태에 10개의 새로운 아이템을 추가
  // const loadMoreItems = () => {
  //   setItems((prevItems) => [
  //     ...prevItems, // 기존 아이템 유지
  //     ...Array.from({ length: 10 }, (_, i) => ({
  //       src: `${prevItems.length + i + 1}.jpg`, // 새 이미지 URL
  //       heightClass: `height${((prevItems.length + i) % 3) + 1}`, // 높이 클래스 순환
  //     })),
  //   ]);
  // };
  
  // // `useEffect`: Intersection Observer를 설정
  // useEffect(() => {
  //   if (!loader.current) return; // `loader`가 아직 연결되지 않았다면 종료
    
  //   const currentLoder = loader.current; //`loder.current`를 변수로 저장
    
  //   // Intersection Observer 생성
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       // 감시 대상 요소(loader)가 뷰포트에 나타나면 새로운 아이템을 로드
  //       if (entries[0].isIntersecting) {
  //         loadMoreItems(); // 무한 스크롤 로직
  //       }
  //     },
  //     { threshold: 1.0 } // 타겟 요소가 100% 화면에 나타났을 때 트리거
  //   );
    
  //   observer.observe(currentLoder); // `loader` 참조 연결
    
  //   return () => {
  //     if (currentLoder) observer.unobserve(currentLoder); // 컴포넌트 언마운트 시 observer 해제
  //   };
  // }, []);
  
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
      const response = await ApiAxios.get(`/post/galleryView?page=${page}`);
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
