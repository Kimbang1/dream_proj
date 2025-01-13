import React, { useEffect, useState } from "react";
import AxiosApi from "../../servies/AxiosApi";
import { useLocation, useParams } from "react-router-dom"; // 라우터를 사용하여 파라미터를 받을 수 있음

function DetailsPage() {
  const location = useLocation();
  const { itemId } = location.state || {};
  const [item, setItem] = useState(null); // 불러온 데이터
  const [comments, setComments] = useState([]); // 댓글 상태
  const [newComment, setNewComment] = useState(""); // 새 댓글 입력 상태

  useEffect(() => {
    if (!itemId) return;

    const fetchData = async () => {
      try {
        const response = await AxiosApi.get(`/contents/postView/${itemId}`);
        setItem(response.data); // 데이터 로드 성공 시 상태 설정
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      }
    };

    fetchData();
  }, [itemId]);

  // 댓글 추가 함수
  const handleAddComment = () => {
    if (!newComment.trim()) return;

    setComments((prev) => [
      ...prev,
      { id: Date.now(), itemId, text: newComment, replies: [] },
    ]);
    setNewComment(""); //댓글 입력 초기화
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

  if (!itemId) return <div>Loading...</div>; // 게시물이 로딩 중일 때

  return (
    <div className="DetailFrame">
      {/* 게시물 내용 */}
      <div className="DetailItem">
        {/* 이미지 영역 */}
        <div className="DetailImgArea">
          <img
            src={`/contentImage/${item?.upFileName || ""}`}
            alt="게시물 이미지"
            className="PostImage"
          />
          <div className="date">{formatDate(item?.createAt)}</div>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="DetailRight">
          <div className="detailContentArea">
            <div className="up">
              <div className="author">{itemId.tagId}</div>
              <div className="likes">좋아요{itemId.likeCount}개</div>
            </div>
            <div className="content">{itemId.content}</div>
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
            <button onClick={() => handleAddComment(itemId.id)}>
              댓글 작성
            </button>
          </div>

          {/* 댓글 리스트 */}
          <div className="CommentsList">
            {comments
              .filter((comment) => comment.itemId === item?.id)
              .map((comment) => (
                <div key={comment.id} className="CommentItem">
                  <div className="CommentContent">
                    <strong>댓글:</strong> {comment.text}
                  </div>

                  {/* 댓글의 댓글 영역 */}
                  <div className="Replies">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="ReplyItem">
                        ↳ {reply.text}
                      </div>
                    ))}

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
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailsPage;
