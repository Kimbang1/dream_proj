import React, { useCallback, useEffect, useState } from "react";
import axios from "axios"; // axios를 사용해 API 호출
import ApiAxios from "../../servies/AxiosApi";

function UserPost() {
  const [items, setItems] = useState([]); // 불러온 데이터
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [page, setPage] = useState(1); // 현재 페이지
  const [hasMore, setHasMore] = useState(true); // 더 이상 로드할 데이터가 있는지 확인

  // 데이터 로드 함수
  const loadData = useCallback(async () => {
    if (loading || !hasMore) return; // 이미 로딩 중이거나 더 이상 로드할 데이터가 없으면 요청하지 않음
    setLoading(true);

    try {
      // 실제 데이터 API 호출 예시 (여기서는 임의로 데이터를 만들어서 사용)
      const response = await ApiAxios.get(`/post/postView?page=${page}`);
      const newData = response.data;

      if (newData.length === 0) {
        setHasMore(false); // 데이터가 더 이상 없으면
      } else {
        setItems((prevItems) => [...prevItems, ...newData]); // 기존에 새로운 데이터 추가
        setPage((prevPage) => prevPage + 1); // 다음 페이지로 이동
      }
    } catch (error) {
      console.error("데이터 로드 실패 :", error);
    }
    setLoading(false);
  }, [loading, hasMore, page]);

  // 스크롤 이벤트 처리
  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const bottomPosition = document.documentElement.scrollHeight;

    // 페이지 끝에 거의 다 도달했을 때 데이터 로드
    if (scrollPosition + 10 >= bottomPosition) {
      loadData(); // 페이지 끝에 가까우면 데이터 로드
    }
  }, [loadData]);

  // 컴포넌트 마운트 시 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // 컴포넌트 초기 데이터 로드
  useEffect(() => {
    loadData();
  }, []);  
//  loadData;
  return (
    <div className="UserPostView">
      <div className="PostArea">
        {items.map((item, index) => (
          <div key={index} className="PostItem">
            <div className="left">
              <div className="userId">
                <span>{item.uuid}</span>
              </div>
              <div className="content">
                <span>{item.content}</span>
              </div>
            </div>

            <div className="right">
              <div className="imageContainer">
                <img
                  src={item.filePath}
                  alt={`Image related to post ${item.linkId}`} />
              </div>
              <div className="RightUpper">
                <span>댓글 {item.comments}</span>
                <span>좋아요 {item.likes}</span>
              </div>
              <div className="WriteTime">{item.writeTime}</div>
            </div>
          </div>
        ))}
      </div>
      {loading && <div>로딩 중...</div>} {/* 로딩 중 텍스트 */}
      {!hasMore && <div>더 이상 불러올 데이터가 없습니다.</div>}{" "}
      {/* 데이터 없음 메시지 */}
    </div>
  );
}

export default UserPost;
