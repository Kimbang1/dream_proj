import React, { useState, useEffect } from "react";
// import AxiosApi from "../../servies/AxiosApi";
import axios from "axios";
import useImageTimeCheck from "../../hook/TimeCheck"; // 시간 체크 훅
import useImageMetadata from "../../hook/UseMetadata"; // 메타데이터 전송 훅

function ContentWrite() {
  const [file, setFile] = useState(null); // 사진 파일 상태
  console.log("파일객체:", file);
  const [content, setContent] = useState(""); // 입력란 텍스트 상태
  const [link_id, setLinkId] = useState(null); // 업로드된 파일의 link_id 상태
  const [posts, setPosts] = useState([]); // 게시물 리스트 상태
  const [previewURL, setPreviewURL] = useState(null); // 미리보기 URL 상태
  const { validateImageTime, errorMessage: timeErrorMessage } =
    useImageTimeCheck(); // 시간 체크 훅 사용
  const { handleMetadataAndSend, errorMSG } = useImageMetadata(); // 메타데이터 전송 훅 사용

  // 파일 선택 핸들러
  const handleFileChange = async (event) => {
    event.preventDefault();
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      alert("파일을 선택하지 않았습니다.");
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files && e.target.files[0]; // 파일이 선택되지 않은 경우 처리
    if (!selectedFile) {
      console.warn("선택된 파일이 없습니다.");
      return;
    }

    // FileReader를 사용하여 미리보기 URL 생성
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewURL(reader.result); // 데이터 URL을 previewURL에 저장
    };
    reader.onerror = () => {
      alert("파일을 읽는 도중 문제가 발생했습니다.");
    };

    reader.readAsDataURL(selectedFile);


    // 파일 크기 및 형식 확인
    const validTypes = ["image/jpeg", "image/png", "image/heic", "image/webp"];
    const maxSize = 30 * 1024 * 1024;
    if (
      selectedFile.size > maxSize ||
      !validTypes.includes(selectedFile.type)
    ) {
      alert("파일이 너무 크거나 지원하지 않는 형식입니다.");
      return;
    }

    // 시간 체크
    const isValidImageTime = await validateImageTime(selectedFile);
    if (!isValidImageTime) {
      alert("업로드 가능한 시간이 초과된 사진입니다.");
      return;
    }

      // 메타데이터 추출 및 서버로 전송
      await handleMetadataAndSend(selectedFile);

      // 파일 자체 저장
      setFile(selectedFile);
    }
  };

  // 텍스트 입력 핸들러
  const handleTextUpdate = (e) => {
    setContent(e.target.value);
  };

  // 게시글 작성 완료 핸들러
  const handleComplete = async () => {
    if (!link_id || !content.trim()) {
      alert("사진 업로드를 완료하고 내용을 입력하세요.");
      return;
    }

    // 게시물 요청
    const formData = new FormData();
    formData.append("file", file); // 파일 첨부
    formData.append("content", content); // 텍스트 첨부

    try {
      const response = await axios.post("/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPosts([...posts, response.data]); // 게시물 리스트 업데이트
      setContent(""); // 텍스트 필드 초기화
      setFile(null); // 파일 상태 초기화
      setLinkId(null); // link_id 초기화
      setPreviewURL(null); // 미리보기 URL 초기화
      alert("게시물이 성공적으로 저장되었습니다.");
    } catch (error) {
      console.error("게시물 저장 실패: ", error);
      alert("게시물 저장 중 문제가 발생했습니다.");
    }
    console.log("이미지 URL:", URL.createObjectURL(file));
  };

  return (
    <div className="box">
      {/* 사진 업로드 영역 */}
      <div className="uploadArea">
        {/* 업로드된 이미지 미리보기 */}
        {previewURL && (
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
        <p style={{ color: "red" }}>
          {timeErrorMessage || errorMSG} {/* 하나의 오류 메시지만 표시 */}
        </p>
      )}

      {/* 게시글 작성 영역 */}
      <div className="contentArea">
        <div className="completeiconArea">
          {/* 카메라 아이콘 */}
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
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </div>
    </div>
  );

};
}

export default ContentWrite;
