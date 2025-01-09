import React, { useState, useCallback, useEffect } from "react";
import AxiosApi from "../../servies/AxiosApi";

function Post() {
  const [items, setItems] = useState([]); // 불러온 데이터
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [hasMore, setHasMore] = useState(true); // 더 이상 로드할 데이터가 있는지 확인

  // 데이터 로드 함수
  const loadMoreItems = useCallback(async () => {
    if (loading || !hasMore) return; // 이미 로딩 중이거나 더 이상 로드할 데이터가 없으면 요청하지 않음
    setLoading(true);

    try {
      // 실제 데이터 API 호출 예시
      const response = await AxiosApi.get("/contents/postView");
      const newData = response.data;

      if (newData.length === 0) {
        setHasMore(false); // 데이터가 더 이상 없으면
      } else {
        setItems((prevItems) => [...prevItems, ...newData]); // 기존에 새로운 데이터 추가
      }
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    }
    setLoading(false);
  }, [loading, hasMore]);

  // 스크롤 이벤트 처리
  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const bottomPosition = document.documentElement.scrollHeight;

    // 페이지 끝에 거의 다 도달했을 때 데이터 로드
    if (scrollPosition + 10 >= bottomPosition) {
      loadMoreItems(); // 페이지 끝에 가까우면 데이터 로드
    }
  }, [loadMoreItems]);

  // 컴포넌트 마운트 시 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // 컴포넌트 초기 데이터 로드
  useEffect(() => {
    loadMoreItems();
  }, []); // 처음 렌더링 시 데이터 로드

  return (
    <div className="PostView">
      <div className="PostArea">
        {items.map((item, index) => (
          <div key={index} className="PostItem">
            <div className="left">
              <div className="userId">
                <span>{item.id}</span>
              </div>
              <div className="content">
                <span>{item.content}</span>
              </div>
            </div>

            <div className="right">
              {item.image_url && (
                <div className="imagArea">
                  <img
                    src={item.image_url}
                    alt="게시글 이미지"
                    className="postImage"
                  />
                </div>
              )}
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

export default Post;
