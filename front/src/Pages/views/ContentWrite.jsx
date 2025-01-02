import React, { useState } from "react";
import AxiosApi from "../../servies/AxiosApi";
import useImageTimeCheck from "../../hook/TimeCheck"; // 시간 체크 훅
import useImageMetadata from "../../hook/UseMetadata"; // 메타데이터 전송 훅

function ContentWrite() {
  const [file, setFile] = useState(null); // 사진 파일 상태
  const [content, setContent] = useState(""); // 입력란 텍스트 상태
  const [posts, setPosts] = useState([]); // 게시물 리스트 상태
  const { validateImageTime, errorMessage: timeErrorMessage } =
    useImageTimeCheck(); // 시간 체크 훅 사용
  const { handleMetadataAndSend, errorMSG, previewURL } = useImageMetadata(); // 메타데이터 전송 훅 사용

  // 파일 선택 핸들러
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      alert("파일을 선택하지 않았습니다.");
      return;
    }

    // 파일 크기 및 형식 확인
    const validTypes = ["image/jpeg", "image/png", "image/heic"];
    const maxSize = 30 * 1024 * 1024;
    if (
      selectedFile.size > maxSize ||
      !validTypes.includes(selectedFile.type)
    ) {
      alert("파일이 너무 크거나 지원하지 않는 형식입니다.");
      return;
    }

    // 시간 체크 및 메타데이터 전송
    const isValidImageTime = await validateImageTime(selectedFile);
    if (!isValidImageTime) {
      alert("업로드 가능한 시간이 초과된 사진입니다.");
      return;
    }

    const isMetadataSent = await handleMetadataAndSend(selectedFile);
    if (isMetadataSent) {
      setFile(selectedFile);
      console.log("파일이 성공적으로 처리되었습니다.");
    } else {
      alert("파일 처리에 실패했습니다.");
    }
  };

  const handleTextUpdate = (e) => {
    setContent(e.target.value);
  };

  const handleComplete = async () => {
    if (!file || !content.trim()) {
      alert("사진과 내용을 모두 입력하세요.");
      return;
    }

    try {
      const response = await AxiosApi.post("/post/upload", {
        content,
      });
      setPosts([...posts, response.data]);
      setContent("");
      alert("게시물이 저장되었습니다.");
    } catch (error) {
      console.error("게시물 저장 실패:", error);
      alert("게시물 저장 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className="box">
      {/* 사진 업로드 영역 */}

      <div className="uploadArea">
        {/* 업로드된 이미지 영역 */}
        {file && (
          <img
            src={previewURL}
            alt="업로드된 이미지"
            className="uploadedImage"
          />
        )}

        {/* 파일 선택 클릭 영역 */}
        <input
          type="file"
          accept="image/jpeg,image/png,image/heic,image/jpg" // 허용할 파일 형식
          style={{ display: "none" }}
          id="fileInput"
          onChange={handleFileChange}
        />
        <label htmlFor="fileInput">
          {!file && (
            <div className="clickArea">
              {/* 아이콘은 파일이 업로드 되면 숨겨짐 */}
              <img
                src="/images/plus.png"
                alt="추가아이콘"
                className="uploadIcon"
              />
            </div>
          )}
        </label>
      </div>

      {/* 오류 메시지 */}
      {(timeErrorMessage || errorMSG) && (
        <p style={{ color: "red" }}>{timeErrorMessage || errorMSG}</p>
      )}

      {/* 게시글 영역 */}
      <div className="contentArea">
        <div className="completeiconArea">
          {/* 카메라 아이콘을 파일 업로드와 연결 */}
          <label htmlFor="fileInput" className="cameraIcon">
            <img
              className="cameraIcon"
              src="/images/camera.png"
              alt="카메라사진"
            />
          </label>
          <button onClick={handleComplete}>작성 완료</button>
        </div>
        <textarea
          name="inputContent"
          id="inputContent"
          placeholder="입력란"
          maxLength={300}
          value={content}
          onChange={handleTextUpdate}
        ></textarea>
      </div>
    </div>
  );
}

export default ContentWrite;
