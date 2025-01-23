import React from "react";
import { useNavigate } from "react-router-dom";

function Manager() {
  const navigate = useNavigate("");

  return (
    <div className="ManagerChoice">
      <div className="ManagerBackground">
        <div className="ChoiceTwo">
          <div className="buttonAreas">
            <button className="TwoButtons" onClick={() => navigate("/UserList")}>유저 리스트</button>
          </div>

          <div className="buttonAreas">
            <button className="TwoButtons" onClick={() => navigate("/GalleryList")}>
              게시물 목록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Manager;
