import React, { useState, useCallback, useEffect } from "react";
import AxiosApi from "../../servies/AxiosApi";
import { useLocation, useNavigate } from "react-router-dom";

function UserPost({ uuid, heartStates, toggleHeart }) {
  const location = useLocation();
  const { linkId } = location.state || {};
  const [items, setItems] = useState([]); // 불러온 데이터
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [hasMore, setHasMore] = useState(true); // 더 이상 로드할 데이터가 있는지 확인
  const navigate = useNavigate();

  const handleDetails = (event, linkId) => {
    event.preventDefault();
    console.log("Navigating to DetailsPage with linkId:", linkId);
    navigate("/DetailsPage", { state: { linkId } });
  };

  // 날짜 포맷 함수
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
        const encodedUuid = encodeURIComponent(uuid);
        const response = await AxiosApi.get(
          `/contents/userView?uuid=${encodedUuid}`
        );
        const data = response.data || {};

        if (data.postDetails) {
          setItems([
            {
              up_filename: data.postDetails.up_filename || "",
              create_at: data.postDetails.create_at || "",
              tag_id: data.postDetails.tag_id || "",
              content: data.postDetails.content || "",
              heartClicked:
                data.postDetails.heartClicked !== undefined
                  ? data.postDetails.heartClicked
                  : false, // heartClicked가 undefined일 경우 false로 처리
              likeCount: data.likeCount || 0,
            },
          ]);
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      }
    };
    fetchData();
  }, [linkId, uuid]);

  const loadMoreItems = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const encodedUuid = encodeURIComponent(uuid);
      const response = await AxiosApi.get(
        `/contents/userView?uuid=${encodedUuid}`
      );
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
  }, [loading, hasMore, uuid]);

  const handleHeartClick = async (itemId) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.linkId === itemId
          ? {
              ...item,
              heartClicked: !item.heartClicked,
              likeCount: item.heartClicked
                ? item.likeCount - 1
                : item.likeCount + 1,
            }
          : item
      )
    );

    const updatedItem = items.find((item) => item.linkId === itemId);
    console.log("Updated heartClicked value:", updatedItem?.heartClicked);

    try {
      await AxiosApi.post(`/contents/like?linkId=${itemId}`, {});
    } catch (error) {
      console.error("좋아요 상태 업데이트 실패:", error);
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.linkId === itemId
            ? {
                ...item,
                heartClicked: !item.heartClicked,
                likeCount: item.heartClicked
                  ? item.likeCount + 1
                  : item.likeCount - 1,
              }
            : item
        )
      );
    }
  };

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
  }, []);

  return (
    <div className="UserPostView">
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
                        ? "/images/redheart.png"
                        : "/images/heart.png"
                    }
                    alt="하트 아이콘"
                    onClick={(e) => {
                      e.stopPropagation();
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

export default UserPost;
