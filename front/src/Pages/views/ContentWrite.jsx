import React, { useState, useEffect } from "react";
import AxiosApi from "../../servies/AxiosApi";
import useImageTimeCheck from "../../hook/TimeCheck"; // 시간 체크 훅
import useImageMetadata from "../../hook/UseMetadata"; // 메타데이터 전송 훅
import { useNavigate } from "react-router-dom";

function ContentWrite() {
  const [file, setFile] = useState(null); // 사진 파일 상태
  const [content, setContent] = useState(""); // 입력란 텍스트 상태
  const [link_id, setLinkId] = useState(null);
  const [posts, setPosts] = useState([]); // 게시물 리스트 상태
  const [uuid, setUuid] = useState("");

  const { validateImageTime, errorMessage: timeErrorMessage } =
    useImageTimeCheck(); // 시간 체크 훅 사용
  const { handleMetadataAndSend, errorMSG, previewURL } = useImageMetadata(); // 메타데이터 전송 훅 사용
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const userProfile = async () => {
      try {
        const response = await AxiosApi.get("/user/leftBar"); // API 요청
        console.log("API 응답 데이터:", response.data); // 응답 데이터 확인
        setUuid(response.data.user.uuid);
      } catch (error) {
        
      }
    };
    userProfile();
  }, []);

  // 컴포넌트 언마운트 시 imagePreview 삭제
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // 파일 선택 핸들러
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      alert("파일을 선택하지 않았습니다.");
      return;
    }

    // 이전 미리보기 URL 해제
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    // 새 미리보기 URL 생성
    const previewUrlTest = URL.createObjectURL(selectedFile);
    setImagePreview(previewUrlTest);

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

    // 시간 체크 및 메타데이터 전송
    const isValidImageTime = await validateImageTime(selectedFile);
    if (!isValidImageTime) {
      alert("업로드 가능한 시간이 초과된 사진입니다.");
      return;
    }

    // 메타데이터 처리 및 전송
    const metadata = await handleMetadataAndSend(selectedFile, content);
    console.log("메타데이터 확인:", metadata);
    if (metadata) {
      setFile(selectedFile);
      setLinkId(metadata.link_id); // 서버에서 반환된 link_id
    } else {
      alert("파일 처리에 실패했습니다.");
    }
  };

  const handleTextUpdate = (e) => {
    setContent(e.target.value);
  };

  const navigate = useNavigate();
  const handleComplete = async () => {
    if (!file || !content.trim()) {
      alert("사진과 내용을 모두 입력하세요.");
      navigate("/ContentWrite");
      return; // 빠른 종료료
    }

    try {
      const response = await AxiosApi.post("/contents/postUpload", {
        content,
        link_id,
        latitude: previewURL.latitude || "", // 위도
        longitude: previewURL.longitude || "", // 경도
      });

      if(!response.data || !response.data.uuid) {
        throw new Error("서버에서 유효한 응답을 받지 못했습니다.");
      }

      setPosts([...posts, response.data]);

      setContent("");
      setFile(null);
      setLinkId(null);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      navigate("/user/UserMainpage", { state: { uuid } });
      alert("게시물이 저장되었습니다.");
    } catch (error) {
      console.error("게시물 저장 실패: ", error);
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
            src={imagePreview}
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
