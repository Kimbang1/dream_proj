import React, { useState, useCallback, useEffect } from "react";
import AxiosApi from "../../servies/AxiosApi";
import { useNavigate, useLocation } from "react-router-dom";

function Post() {
  const [items, setItems] = useState([]); // 불러온 데이터
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [hasMore, setHasMore] = useState(true); // 더 이상 로드할 데이터가 있는지 확인
  const [linkId, setLinkId] = useState(null); // linkId 상태

  // 상세페이지로 이동
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.linkId) {
      setLinkId(location.state.linkId); // 링크 아이디 설정
    }
  }, [location]);

  const handleDetails = (event, linkId) => {
    event.preventDefault();
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

  // 데이터 로드 함수
  const loadMoreItems = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const response = await AxiosApi.get("/contents/postView");
      const newData = response.data;
      if (newData.length === 0) {
        setHasMore(false);
      } else {
        setItems((prevItems) => {
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

  // 좋아요 클릭 시 서버로 업데이트 요청 및 로컬 상태 반영
  const handleHeartClick = async (linkId) => {
    try {
      // 백엔드로 좋아요 상태 업데이트 요청
      const response = await AxiosApi.post(
        `/contents/like?linkId=${linkId}`,
        {}
      );

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

  useEffect(() => {
    if (!linkId) return; // linkId가 없으면 실행하지 않음

    const fetchData = async () => {
      try {
        const response = await AxiosApi.get(
          `/contents/viewDetails?linkId=${linkId}`
        );
        const data = response.data || {};
        setItems({
          upFileName: data.postDeatils.up_filename || "",
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

    fetchData(); // fetchData 호출
  }, [linkId]); // linkId가 변경될 때마다 실행

  // 스크롤 이벤트 처리
  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const bottomPosition = document.documentElement.scrollHeight;

    if (scrollPosition + 10 >= bottomPosition) {
      loadMoreItems();
    }
  }, [loadMoreItems]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    loadMoreItems();
  }, []); // 처음 렌더링 시 데이터 로드

  return (
    <div className="PostView">
      {items.map((item) => (
        <div
          key={item.linkId}
          className="PostItem"
          onClick={(e) => handleDetails(e, item.linkId)}
        >
          <div className="PostArea">
            <img
              src={`/contentImage/${item.upFileName}`}
              alt="게시물 이미지"
              className="PostImage"
            />
          </div>

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
                        ? "/images/redheart.png" // true -> 빨간 하트
                        : "/images/heart.png" // false -> 기본 하트
                    }
                    alt="하트 아이콘"
                    onClick={(e) => {
                      e.stopPropagation(); // 클릭 이벤트가 부모로 전파되지 않도록
                      handleHeartClick(item.linkId);
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </div>
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
