import React, { useRef } from "react";
import "./style/style.css";
import Header from "./layout/Header"; // Header 컴포넌트
import LeftBar from "./layout/LeftBar"; // LeftBar 컴포넌트

function App() {
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div id="wrap">
      {/* 세션값을 줄 장소 일반 유저인지 관리자인지 */}
      <Header />

      <div id="Mainview">
        <div id="left">
          {/* 세션값을 줄 장소 일반 유저인지 관리자인지 */}
          <LeftBar />
        </div>

        <div id="right">
          <div id="PostviewArea">
            {/* 반복되게 for each사용할곳 */}
            <div className="PParea">출력칸: 사진이오</div>

            <div className="PTarea">출력칸 : 글이올시다</div>
          </div>

          <div id="rsideBar">
            <form id="uploadArea" action="">
              <span>
                <textarea
                  name="textarea"
                  placeholder="게시글을 작성하시오"
                ></textarea>
              </span>

              <div id="frame3">
                <div className="PhotoinputArea">
                  <input
                    type="file"
                    id="imageUpload"
                    name="image"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                  />
                  <img
                    src="/images/cameraNoback.png"
                    alt="카메라 사진"
                    id="upload"
                    onClick={handleImageClick}
                  />
                </div>

                <div className="PhotoinputArea">
                  <button type="button">작성</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
