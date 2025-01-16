import React, { useState, useCallback, useEffect } from "react";
import AxiosApi from "../../servies/AxiosApi";
import { useLocation, useNavigate } from "react-router-dom";

function Post() {
  const [items, setItems] = useState([]); // 불러온 데이터
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [hasMore, setHasMore] = useState(true); // 더 이상 로드할 데이터가 있는지 확인
  const location = useLocation();
  const { linkId } = location.state || {};
  const navigate = useNavigate();
  // UserPost 컴포넌트에서

  const handleDetails = (event, linkId) => {
    event.preventDefault();
    console.log("Navigating to DetailsPage with linkId:", linkId);
    navigate("/DetailsPage", { state: { linkId } });
  };

  // 날짜 컷팅
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!linkId) return;
    const fetchData = async () => {
      try {
        const response = await AxiosApi.get(
          `/contents/userView?linkId=${linkId}`
        );
        const data = response.data || {};
        setItems({
          up_filename: data.postDetails.up_filename || "",
          create_at: data.postDetails.create_at || "",
          tag_id: data.postDetails.tag_id || "",
          content: data.postDetails.content || "",
          heartClicked: data.likeCheck || false, // 좋아요 클릭 상태 추가
          likeCount: data.likeCount || 0, // 좋아요 개수
        });
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      }
    };
    fetchData();
  }, [linkId]);

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

  // 좋아요 클릭 시 서버로 업데이트
  const handleHeartClick = async (linkId) => {
    try {
      // 백엔드로 좋아요 갯수 업데이트 요청
      const response = await AxiosApi.post(`/contents/like?linkId=${linkId}`);

      // 서버에서 반환된 값 (참/거짓)
      if (response.data) {
        // 서버에서 true 반환 시, 하트를 빨간색으로 설정
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.linkId === linkId
              ? { ...item, heartClicked: !item.heartClicked } // 상태 반전
              : item
          )
        );
      } else {
        // 서버에서 false 반환 시, 하트를 기본 하트로 설정
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.linkId === linkId
              ? { ...item, heartClicked: !item.heartClicked } // 상태 반전
              : item
          )
        );
      }
    } catch (error) {
      console.error("좋아요 상태 업데이트 실패:", error);
    }
  };

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
      {items.map((item) => {
        return (
          <div
            key={item.linkId}
            className="PostItem"
            onClick={(e) => handleDetails(e, item.linkId)}
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
                <div
                  className="content"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                ></div>
              </div>
              <div className="rightContents">
                <div className="rightUP">
                  <div className="comments">댓글 {item.commentCount}개</div>
                  <div className="likes">
                    <img
                      className="heart"
                      src={
                        item.heartClicked
                          ? "/images/redheart.png"
                          : "/images/heart.png"
                      }
                      alt="하트 아이콘"
                      onClick={(e) => {
                        e.stopPropagation(); // 클릭 이벤트가 부모로 전파되지 않도록
                        handleHeartClick(item.linkId, item.likeCount);
                      }}
                      style={{ cursor: "pointer" }}
                    />
                    {item.likeCount}개
                  </div>
                </div>
                <div className="date">{formatDate(item.createAt)}</div>
              </div>
            </div>
          </div>
        );
      })}
      {loading && <div>로딩 중...</div>}
      {!hasMore && <div>더 이상 불러올 데이터가 없습니다.</div>}
    </div>
  );
}

export default Post;
