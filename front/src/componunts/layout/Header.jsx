import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AlarmComponent from "../modal/AlramModal"; // 알람 컴포넌트 임포트
import AxiosApi from "../../servies/AxiosApi";

function Header({ setIsMainPage }) {
  const [searchMonitor, setSearchMonitor] = useState("");
  const [recentSearch, setRecentSearch] = useState([]);
  const [isAlramOpen, setIsAlramOpen] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false); // 아코디언 열림 상태
  const navigate = useNavigate();
  const monitorsData = []; // 예제 데이터
  const inputRef = useRef(null); // 검색창 참조

  // 검색어 입력 핸들러
  const onChange = (e) => {
    setSearchMonitor(e.target.value);
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
        const response = await AxiosApi.get(
          "/contents/search",
          {params: {query: searchMonitor}}
        );
        console.log("검색 결과: ", response.data);

        // 검색 페이지로 이동하면서 검색어 전달
        navigate(`/SearchRes?query=${encodeURIComponent(searchMonitor)}`,
        {state: { searchResults: response.data},
        });
      } catch(error) {
        console.error("검색 요청 실패: ", error);
      }

    }
  };

  // 최근 검색어 삭제 핸들러
  const handleDeleteSearch = (index) => {
    setRecentSearch((prev) => prev.filter((_, i) => i !== index));
  };

  // 알람 모달 핸들러 - 상태 토글
  const toggleAlarmModal = () => {
    setIsAlramOpen((prev) => !prev);
  };

  // 글쓰기 페이지 이동
  const handleWritePage = () => {
    navigate("/ContentWrite");
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

  return (
    <div className="header">
      {/* 검색 입력창 */}
      <div className="inputArea" ref={inputRef}>
        <form onSubmit={handleSearchSubmit}>
          <div className="dodbogiArea">
            <img src="/images/dodbogi.png" alt="돋보기" />
          </div>
          <input
            type="text"
            className="search"
            placeholder="검색할 내용을 적어주세요"
            value={searchMonitor}
            onChange={onChange}
            onFocus={() => setIsAccordionOpen(true)} // 포커스 시 아코디언 열림
          />
        </form>

        {/* 아코디언 영역 */}
        {isAccordionOpen && (
          <div className="accordion">
            {/* 최근 검색어 */}
            <div className="recentSearches">
              <h4>최근 검색어</h4>
              <ul>
                {recentSearch.length > 0 ? (
                  recentSearch.map((search, index) => (
                    <li key={index}>
                      {search}
                      <button
                        onClick={() => handleDeleteSearch(index)}
                        style={{ marginLeft: "10px", cursor: "pointer" }}
                      >
                        &times; {/* X 버튼 */}
                      </button>
                    </li>
                  ))
                ) : (
                  <p>최근 검색어가 없습니다.</p>
                )}
              </ul>
            </div>

            {/* 연관 검색어 */}
            <div className="relatedSearches">
              <h4>연관 검색어</h4>
              <ul>
                {filteredMonitors.length > 0 ? (
                  filteredMonitors.map((monitor, index) => (
                    <li key={index}>{monitor.name}</li>
                  ))
                ) : (
                  <p>연관 검색어가 없습니다.</p>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* 기능 아이콘 영역 */}
      <div className="functionArea">
        <img
          onClick={toggleAlarmModal} // 알람 모달 토글
          className="imges"
          src="/images/bell.png"
          alt="종모양"
        />
        <img
          onClick={handleWritePage}
          className="imges"
          src="/images/plus.png"
          alt="+"
        />
      </div>

      {/* 알람 모달 */}
      {isAlramOpen && (
        <AlarmComponent
          isOpen={isAlramOpen}
          closeAlarmModal={toggleAlarmModal} // 모달 닫기 핸들러
        />
      )}
    </div>
  );
}

export default Header;
