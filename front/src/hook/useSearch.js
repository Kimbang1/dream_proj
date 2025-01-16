import { useState, useEffect, useRef } from "react";
import AxiosApi from "../servies/AxiosApi";

export const useSearch = () => {
  const [searchMonitor, setSearchMonitor] = useState(""); // 검색어 상태
  const [recentSearch, setRecentSearch] = useState([]); // 최근 검색어
  const [isAccordionOpen, setIsAccordionOpen] = useState(false); // 아코디언 열림 상태
  const [monitorsData, setMonitorsData] = useState([]); // 연관 검색어 데이터
  const inputRef = useRef(null); // 검색창 참조

  // 검색어 입력 핸들러
  const onChange = (e) => {
    setSearchMonitor(e.target.value); // 검색어 상태 업데이트
    if (!isAccordionOpen) setIsAccordionOpen(true); // 검색 시 아코디언 열림
  };

  // 검색어 제출 핸들러
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchMonitor.trim() !== "") {
      setRecentSearch((prev) => {
        const newSearches = [searchMonitor, ...prev];
        return newSearches.slice(0, 5); // 최대 5개 저장
      });
      setSearchMonitor("");
      setIsAccordionOpen(false); // 검색 후 아코디언 닫기

      // 백엔드로 검색어 전송
      try {
        const response = await AxiosApi.get("/contents/search", {
          params: { query: searchMonitor },
        });
        console.log("검색 결과: ", response.data);
        setMonitorsData(response.data); // 검색 결과 저장
        return response.data; // 검색 결과 반환
      } catch (error) {
        console.error("검색 요청 실패: ", error);
      }
    }
  };

  // 연관 검색어 필터링
  const filteredMonitors =
    monitorsData?.filter((monitorInfo) =>
      monitorInfo.name.toLowerCase().includes(searchMonitor.toLowerCase())
    ) || [];

  // 외부 클릭 이벤트 처리
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsAccordionOpen(false); // 외부 클릭 시 아코디언 닫기
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return {
    searchMonitor,
    setSearchMonitor, // 여기에서 setSearchMonitor을 반환하여 외부 컴포넌트에서 사용할 수 있게 함
    recentSearch,
    setRecentSearch,
    isAccordionOpen,
    setIsAccordionOpen,
    onChange,
    handleSearchSubmit,
    filteredMonitors,
    monitorsData,
    setMonitorsData,
    inputRef,
  };
};
