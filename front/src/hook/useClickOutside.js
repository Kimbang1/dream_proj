// useClickOutside.js
import { useEffect } from "react";

const useClickOutside = (inputRef, closeAccordion) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        closeAccordion(); // 외부 클릭 시 아코디언 닫기
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [inputRef, closeAccordion]);
};

export default useClickOutside;
