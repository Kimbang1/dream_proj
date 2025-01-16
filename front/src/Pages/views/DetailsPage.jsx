import React, { useEffect, useState } from "react";
import AxiosApi from "../../servies/AxiosApi";
import { useLocation } from "react-router-dom";

function DetailsPage() {
  const location = useLocation();
  const { linkId } = location.state || {};
  const [item, setItems] = useState({}); // 불러온 데이터
  const [comments, setComments] = useState([]); // 댓글 상태
  const [newComment, setNewComment] = useState(""); // 새 댓글 입력 상태

  console.log("linkId: ", linkId); // itemId 값이 제대로 전달되었는지 확인

  // 좋아요 클릭 시 서버로 업데이트 요청 및 로컬 상태 반영
  const handleHeartClick = async (linkId) => {
    // 로컬 상태를 먼저 업데이트 (Optimistic Update)
    setItems((prevItem) => ({
      ...prevItem,
      heartClicked: !prevItem.heartClicked, // 하트 상태 토글
      likeCount: prevItem.heartClicked
        ? prevItem.likeCount - 1
        : prevItem.likeCount + 1, // 좋아요 개수 변경
    }));

    try {
      // 서버로 좋아요 상태 업데이트 요청
      await AxiosApi.post(`/contents/like?linkId=${linkId}`, {});
    } catch (error) {
      console.error("좋아요 상태 업데이트 실패:", error);
      // 서버 요청 실패 시, 상태를 다시 되돌리기
      setItems((prevItem) => ({
        ...prevItem,
        heartClicked: !prevItem.heartClicked, // 하트 상태 복구
        likeCount: prevItem.heartClicked
          ? prevItem.likeCount + 1
          : prevItem.likeCount - 1, // 좋아요 개수 복구
      }));
    }
  };

  useEffect(() => {
    if (!linkId) return;

    const fetchData = async () => {
      try {
        const response = await AxiosApi.get(
          `/contents/viewDetails?linkId=${linkId}`
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

    const fetchComments = async () => {
      try {
        const response = await AxiosApi.get(`/comment/list?linkId=${linkId}`);
        const commentData = response.data || [];

        setComments(
          commentData.map((comment) => ({
            commentId: comment.comment_id,
            content: comment.content,
            user_tag_id: comment.user_tag_id,
            replies: [],
          }))
        );
      } catch (error) {
        console.error("댓글 데이터 로드 실패: ", error);
      }
    };

    fetchData();
    fetchComments();
  }, [linkId]);

  // 댓글 추가 함수
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      // 백엔드로 댓글 저장 요청
      const response = await AxiosApi.post("/comment/write", {
        linkId, // 현재 게시물의 Id
        content: newComment, // 댓글 내용용
      });

      const saveComment = response.data.comment;

      setComments((prev) => [
        ...prev,
        {
          commentId: saveComment.comment_id,
          linkId: saveComment.link_id,
          content: saveComment.content,
          user_tag_id: saveComment.user_tag_id,
          replies: [],
        },
      ]);

      setNewComment(""); // 댓글 입력 초기화
    } catch (error) {
      console.log("댓글 저장 실패: ", error);
      alert("댓글 저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 댓글의 댓글 추가 함수
  const handleAddReply = (commentId, replyText) => {
    if (replyText.trim() === "") return;

    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          if (comment.replies.length >= 5) {
            alert("댓글의 댓글은 최대 5개까지만 추가할 수 있습니다.");
            return comment;
          }
          return {
            ...comment,
            replies: [...comment.replies, { id: Date.now(), text: replyText }],
          };
        }
        return comment;
      })
    );
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  if (!linkId || !item) return <div>Loading...</div>; // 게시물이 로딩 중일 때

  return (
    <div className="DetailFrame">
      {/* 게시물 내용 */}
      <div className="DetailItem">
        {/* 이미지 영역 */}
        <div className="DetailImgArea">
          <img
            src={`/contentImage/${item?.up_filename || ""}`}
            alt="게시물 이미지"
            className="PostImage"
          />
          <div className="date">{formatDate(item?.create_at)}</div>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="DetailRight">
          <div className="detailContentArea">
            <div className="up">
              <div className="author">@{item?.tag_id || ""}</div>
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
                    handleHeartClick(linkId);
                  }}
                  style={{ cursor: "pointer" }} // 수정된 오타 (cusror -> cursor)
                />
                좋아요 {item.likeCount}개 {/* 좋아요 개수 출력 */}
              </div>
            </div>
            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: item.content || "" }}
            ></div>
          </div>

          {/* 댓글 입력 영역 */}
          <div className="CommentArea">
            <input
              className="CommentInputArea"
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력해 주세요"
            />
            <button onClick={handleAddComment}>댓글 작성</button>
          </div>

          {/* 댓글 리스트 */}
          <div className="CommentsList">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.commentId} className="CommentItem">
                  <div className="CommentContent">
                    <strong>{comment.user_tag_id}</strong> {comment.content}
                  </div>

                  {/* 댓글의 댓글 영역 */}
                  <div className="Replies">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="ReplyItem">
                        ↳ {reply.text}
                      </div>
                    ))}
                  </div>

                  {/* 댓글의 댓글 입력 */}
                  <div className="ReplyInput">
                    <input
                      type="text"
                      placeholder="댓글의 댓글을 입력하세요"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddReply(comment.id, e.target.value);
                          e.target.value = ""; // 입력값 초기화
                        }
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div>댓글이 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailsPage;
