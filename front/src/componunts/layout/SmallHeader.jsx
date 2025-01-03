import React from "react";
import { useNavigate } from "react-router-dom";
import Bar from "../BarStyle/Bar";

function SmallHeader({ setIsUserMainPage }) {
  const navigate = useNavigate();
  const handlehomeClick = () => {
    setIsUserMainPage(false);
    navigate("/Mainview");
  };
  return (
    <div id="smallHeda">
      <div className="logo">
        <img onClick={handlehomeClick} src="/images/logo4.png" alt="로고사진" />
      </div>

      <div className="right">
        <Bar />
      </div>
    </div>
  );
}

export default SmallHeader;
