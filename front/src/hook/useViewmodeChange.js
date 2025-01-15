import { useState } from "react";

export const useViewmodeChange = () => {
  const [viewMode, setViewMode] = useState("all"); // "all" 또는 "admin"으로 모드 관리

  // 모드 변경 함수
  const handleViewChange = (mode) => {
    setViewMode(mode);
  };

  return {
    viewMode,
    handleViewChange,
  };
};
