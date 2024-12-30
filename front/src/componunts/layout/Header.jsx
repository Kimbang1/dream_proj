import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AlarmComponent from "../modal/AlramModal"; // 알람 컴포넌트 임포트

function Header() {
  // 검색어 상태 관리
  const [searchMonitor, setSearchMonitor] = useState("");
  console.log("searchMonitor", searchMonitor);

  //최근 검색어 상태
  const [recentSearch, setRecentSearch] = useState([]);
  //모달 열림상태
  const [isModalOpen, setIsModalOpen] = useState("");

  //알람 모달 열림상태
  const [isAlramOpen, setIsAlramOpen] = useState(false); // 상태 수정

  //최근검색어 삭제
  const handleDeleteSearch = (index) => {
  
    setRecentSearch((prev) => prev.filter((_, i) => i !== index));
    // 해당 인덱스를 제외한 나머지 항목만 남기기
  };
  
  
  const navigate = useNavigate();
  const handleWritePage = () => {
    navigate("/ContentWrite");
  };

  const monitorsData=[];

  // 검색어 변경 이벤트 핸들러
  const onChange = (e) => {
    setSearchMonitor(e.target.value); // 입력 값을 상태로 저장
  };

  ///////////검색 모달///////////////
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 검색어 제출 핸들러
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchMonitor.trim() !== "") {
      setRecentSearch((prev) => {
        const newSearches = [searchMonitor, ...prev];
        return newSearches.slice(0, 5); // 최대 5개까지만 유지
      });
      setSearchMonitor("");
      closeModal();
    }
  };

  //////////////////알람 모달/////////////////
  const openAlarmModal = () => {
    setIsAlramOpen(true);
  };

  const closeAlarmModal = () => {
    setIsAlramOpen(false);
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
        <img
          onClick={openAlarmModal} // 알람 모달 열기
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

      {/* 알람 컴포넌트 추가 */}
      {isAlramOpen && (
        <AlarmComponent
          isOpen={isAlramOpen} // 알람 모달 열기 상태
          closeAlarmModal={closeAlarmModal} // 알람 모달 닫기 함수 전달
        />
      )}

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
