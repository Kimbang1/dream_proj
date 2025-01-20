import React from "react";

function WideView({ item, isModalOpen, closeModal }) {
  return (
    <>
      {/* 모달 */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={`/contentImage/${item?.up_filename || ""}`}
              alt="확대된 이미지"
              style={{ width: "100%", height: "auto" }}
              onClick={closeModal}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default WideView;
