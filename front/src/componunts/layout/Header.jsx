import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const [searchMonitor, setSearchMonitor] = useState(""); // 검색어 상태 관리
  console.log("searchMonitor", searchMonitor);

  //최근 검색어 상태
  const [recentSearch, setRecentSearch] = useState([]);

  //최근검색어 삭제
  const handleDeleteSearch = (index) => {
    setRecentSearch((prev) => prev.filter((_, i) => i !== index));
    // 해당 인덱스를 제외한 나머지 항목만 남기기
  };

  //모달 열림상태
  const [isModalOpen, setIsModalOpen] = useState("");

  const navigate = useNavigate();
  const handleWritePage = () => {
    navigate("/ContentWrite");
  };
  // 검색 대상 데이터 배열
  const monitorsData = [];

  // 검색어 변경 이벤트 핸들러
  const onChange = (e) => {
    setSearchMonitor(e.target.value); // 입력 값을 상태로 저장
  };

  const openModal = () => {
    setIsModalOpen(true);
  }; //셋이즈모달이 트루일땐 모달창이 열림

  const closeModal = () => {
    setIsModalOpen(false);
  }; //셋이즈모달이 false일땐 모달창이 닫힘

  // 검색어 제출 핸들러
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    //기본동작(새로고침)막는 것

    if (searchMonitor.trim() !== "") {
      // 검색어가 비어있지 않으면 최근 검색어에 추가
      setRecentSearch((prev) => {
        const newSearches = [searchMonitor, ...prev];
        return newSearches.slice(0, 5); // 최대 5개까지만 유지
      });
      setSearchMonitor("");
      closeModal();
    }
  };

  // 검색어를 기준으로 데이터 필터링
  const filteredMonitors =
    monitorsData?.filter((monitorInfo) =>
      monitorInfo.name.toLowerCase().includes(searchMonitor.toLowerCase())
    ) || [];

  return (
    <div className="header">
      {/* 검색 입력창 */}
      <div className="inputArea">
        <form action="handleSearchSubmit">
          <div className="dodbogiArea">
            <img src="/images/dodbogi.png" alt="돋보기" />
          </div>

          <input
            type="text"
            className="search"
            placeholder="검색할 내용을 적어주세요"
            value={searchMonitor}
            onChange={onChange}
            onClick={openModal}
          />
        </form>
      </div>

      <div className="functionArea">
        <img className="imges" src="/images/bell.png" alt="종모양" />

        <img
          onClick={handleWritePage}
          className="imges"
          src="/images/plus.png"
          alt="+"
        />
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
        </div>
      )}

      {filteredMonitors.length > 0 && (
        <ul>
          {filteredMonitors.map((monitor, index) => (
            <li key={index}>{monitor.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Header;
