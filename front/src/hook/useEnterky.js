import React, { useEffect } from "react";

const useEnter = (callback) => {
  useEffect(() => {
    const handleEnterpress = (event) => {
      if (event.key === "Enter") {
        event.preventDefault(); //기본 엔터 동작 방지
        callback(); //전달 받은 콜백 실행
      }
    };

    window.addEventListener("keydown", handleEnterpress);
    return () => {
      window.removeEventListener("keydown", handleEnterpress);
    };
  }, [callback]);
};

export default useEnter;
