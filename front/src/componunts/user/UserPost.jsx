import React, { useState, useCallback, useEffect } from "react";
import AxiosApi from "../../servies/AxiosApi";
import { useNavigate } from "react-router-dom";

function Post() {
  const [items, setItems] = useState([]); // 불러온 데이터
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [hasMore, setHasMore] = useState(true); // 더 이상 로드할 데이터가 있는지 확인

  const navigate = useNavigate();
  // UserPost 컴포넌트에서
  const handleDetails = (itemId) => {
    console.log("Navigating to DetailsPage with itemId:", itemId);
    navigate("/DetailsPage", { state: { itemId } });
  };

  // 날짜 컷팅
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 데이터 로드 함수
  const loadMoreItems = useCallback(async () => {
    if (loading || !hasMore) return; // 이미 로딩 중이거나 더 이상 로드할 데이터가 없으면 요청하지 않음
    setLoading(true);

    try {
      // 실제 데이터 API 호출 예시
      const response = await AxiosApi.get("/contents/userView");
      const newData = response.data;

      if (newData.length === 0) {
        setHasMore(false); // 데이터가 더 이상 없으면
      } else {
        // 기존에 있는 데이터와 중복되지 않는 새로운 데이터를 추가
        setItems((prevItems) => {
          // 새로운 데이터와 기존 데이터에서 중복되는 항목을 필터링
          const uniqueItems = [...prevItems, ...newData].filter(
            (value, index, self) =>
              index === self.findIndex((t) => t.linkId === value.linkId)
          );
          return uniqueItems;
        });
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
    <div className="UserPostView">
      {items.map((item, index) => (
        <div
          key={index}
          className="PostItem"
          onClick={() =>
            handleDetails(item.linkId)
          }
        >
          {/* 이미지 영역 */}
          <div className="PostArea">
            <img
              src={`/contentImage/${item.upFileName}`}
              alt="게시물 이미지"
              className="PostImage"
            />
          </div>

          {/* 콘텐츠 영역 */}
          <div className="contentsArea">
            <div className="leftContents">
              <div className="author">{item.tagId}</div>
              <div className="content">{item.content}</div>
            </div>
            <div className="rightContents">
              <div className="rightUP">
                <div className="comments">댓글 {item.commentCount}개</div>
                <div className="likes">좋아요 {item.likeCount}개</div>
              </div>
              <div className="date">{formatDate(item.createAt)}</div>
            </div>
          </div>
        </div>
      ))}
      {loading && <div>로딩 중...</div>}
      {!hasMore && <div>더 이상 불러올 데이터가 없습니다.</div>}
    </div>
  );
}

export default Post;
