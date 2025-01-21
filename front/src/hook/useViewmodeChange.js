import { useEffect, useState } from "react";
import AxiosApi from "../servies/AxiosApi"

export const useViewmodeChange = () => {
  const [viewMode, setViewMode] = useState("all"); // "all" 또는 "admin"으로 모드 관리
  const [adminList,setAdminLsit] = useState([]);
  const [isLoding, setIsLoding] = useState(false);
  const [error, setError] = useState(null);
  // 모드 변경 함수
  const handleViewChange = (mode) => {
    setViewMode(mode);
  };

  useEffect(()=>{
    const fetchDat = async()=>{
      
      const response = await AxiosApi.get("/adminList/");
      const data = response.data || 
    }

  });

  return {
    viewMode,
    handleViewChange,
  };
};
