import { useEffect, useState } from "react";
import AxiosApi from "../servies/AxiosApi"; // AxiosApi 임포트

export const useViewmodeChange = () => {
  const [viewMode, setViewMode] = useState("all"); // 기본적으로 'all'로 설정
  const [adminList, setAdminList] = useState([]); // 관리자인 경우 관리자 리스트 저장
  const [isLoading, setIsLoading] = useState(false); // 데이터 로딩 상태 관리
  const [error, setError] = useState(null); // 에러 상태 관리

  // 모드 변경 함수
  const handleViewChange = (mode) => {
    setViewMode(mode);
  };

  // 데이터 로드 함수 (관리자 리스트 가져오기)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await AxiosApi.get("/adminList/"); // 관리자 리스트를 가져오는 API 호출
        const data = response.data;

        if (data && data.isAdmin) {
          setViewMode("admin"); // 관리자인 경우 admin 모드로 설정
          setAdminList(data.adminList); // 관리자의 리스트 데이터를 저장
        } else {
          setViewMode("all"); // 관리자가 아닌 경우 모든 모드로 설정
        }
      } catch (err) {
        setError("데이터를 가져오는데 실패했습니다.");
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData(); // 컴포넌트가 렌더링 될 때마다 데이터 호출
  }, []); // 빈 배열로 useEffect 실행 -> 컴포넌트가 처음 마운트 될 때만 실행

  return {
    viewMode,
    adminList,
    handleViewChange,
    isLoading,
    error,
  };
};
