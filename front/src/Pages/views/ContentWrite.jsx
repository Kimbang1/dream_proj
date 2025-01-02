import React, { useState, useEffect } from "react";
// import AxiosApi from "../../servies/AxiosApi";
import axios from "axios";
import useImageTimeCheck from "../../hook/TimeCheck"; // 시간 체크 훅
import useImageMetadata from "../../hook/UseMetadata"; // 메타데이터 전송 훅

function ContentWrite() {
  const [file, setFile] = useState(null); // 사진 파일 상태
  console.log("파일객체:", file);
  const [content, setContent] = useState(""); // 입력란 텍스트 상태
  const [posts, setPosts] = useState([]); // 게시물 리스트 상태
  const { validateImageTime, errorMessage: timeErrorMessage } =
    useImageTimeCheck(); // 시간 체크 훅 사용
  const { handleMetadataAndSend, errorMessage: metadataErrorMessage } =
    useImageMetadata(); // 메타데이터 전송 훅 사용

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files && e.target.files[0]; // 파일이 선택되지 않은 경우 처리
    if (!selectedFile) {
      console.warn("선택된 파일이 없습니다.");
      return;
    }

    console.log("선택한 파일:", selectedFile); // 파일 확인

    // 지원하지 않는 형식일 때
    const validTypes = ["image/jpeg", "image/png", "image/heic"];
    if (!validTypes.includes(selectedFile.type)) {
      alert("지원하지 않는 형식의 사진입니다.");
      return;
    }

    // 이미지 시간 체크
    const isValidImageTime = await validateImageTime(selectedFile);
    if (!isValidImageTime) {
      console.warn("이미지 시간 검사가 실패했습니다.");
      setFile(null); // 파일 초기화
      return;
    }

    // 메타데이터 추출 및 서버로 전송
    await handleMetadataAndSend(selectedFile);
    setFile(selectedFile); // 파일 자체 저장
  };

  useEffect(() => {
    if (file) {
      console.log("업데이트된 파일 상태:".file);
    }
  }, [file]); // file 상태 변경 시 실행

  // 텍스트 입력 핸들러
  const handleTextUpdate = (e) => {
    setContent(e.target.value);
  };

  // 작성 완료 핸들러
  const handleComplete = async () => {
    if (!file || !content.trim()) {
      alert("사진과 내용 모두 입력해야 합니다.");
      return;
    }

    // 게시물 요청
    const formData = new FormData();
    formData.append("file", file); // 파일 첨부
    formData.append("content", content); // 텍스트 첨부

    console.log("FormData to be sent:", formData);
    alert("게시물이 저장되었습니다.");
    try {
      const response = await axios.post("/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const savedPost = response.data; // 서버에서 반환한 데이터
      setPosts([...posts, savedPost]); // 게시물 리스트에 추가

      // 상태 초기화
      setFile(null);
      setContent("");
      alert("게시물이 저장되었습니다.");
    } catch (error) {
      console.error("게시물 저장 실패:", error);
      alert("게시물 저장 중 문제가 발생했으니 재업로드 부탁드립니다.");
    }
    console.log("이미지 URL:", URL.createObjectURL(file));
  };

  return (
    <div className="box">
      {/* 사진 업로드 영역 */}
      <div className="uploadArea">
        {/* 업로드된 이미지 영역 */}
        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="업로드된 이미지"
            className="uploadedImage"
          />
        )}

        {/* 파일 선택 클릭 영역 */}
        <input
          type="file"
          accept="image/jpeg,image/png,image/heic" // 허용할 파일 형식
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
      {(timeErrorMessage || metadataErrorMessage) && (
        <p style={{ color: "red" }}>
          {timeErrorMessage || metadataErrorMessage}
        </p>
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
