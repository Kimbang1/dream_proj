import React from "react";
import { useNavigate } from "react-router-dom"; // navigate 함수 사용을 위해 import

const Managerbutton = () => {
  const navigate = useNavigate(); // navigate 함수 정의

  // 회원목록 페이지로 이동
  const handleUserList = () => {
    console.log("회원페이지 관리자 전용");
    navigate("/UserList");
  };

  // 게시글 목록 페이지로 이동
  const handleGalleryList = () => {
    console.log("게시물리스트 관리자 전용");
    navigate("/GalleryList");
  };

  return (
    <div className="Manager">
      <div className="menu" onClick={handleUserList}>
        <span>회원목록</span>
      </div>
      <div className="menu" onClick={handleGalleryList}>
        <span>게시글 목록</span>
      </div>
    </div>
  );
};

export default Managerbutton;
