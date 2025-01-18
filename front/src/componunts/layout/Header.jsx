import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import AlarmComponent from "../modal/AlramModal"; // 알람 컴포넌트 임포트
import useAccordion from "../../hook/useAccordion"; // 아코디언 훅
import useSearchSubmit from "../../hook/useSearchSubmit"; // 검색어 제출 훅
import { useFilterMonitors } from "../../hook/useFilterMonitors";// 연관 검색어 필터링 훅
import useClickOutside from "../../hook/useClickOutside"; // 외부 클릭 훅
import useAlarmModal from "../../hook/useAlarmModal"; // 알람 모달 훅

function Header() {
  const monitorsData = [];
  const inputRef = useRef(null);

  const { isAccordionOpen, toggleAccordion, closeAccordion } = useAccordion();
  const {
    searchMonitor,
    setSearchMonitor,
    handleSearchSubmit,
    recentSearch,
    setRecentSearch,
  } = useSearchSubmit();

  const { filteredMonitors } = useFilterMonitors(monitorsData, searchMonitor);

  useClickOutside(inputRef, closeAccordion); // 외부 클릭 처리

  const { isAlramOpen, toggleAlarmModal } = useAlarmModal();

  const navigate = useNavigate();

  return (
    <div className="header">
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
            onChange={(e) => {
              setSearchMonitor(e.target.value);
              toggleAccordion(e);
            }}
            onFocus={() => toggleAccordion()} // 포커스 시 아코디언 열림
          />
        </form>

        {isAccordionOpen && (
          <div className="accordion">
            <div className="recentSearches">
              <h4>최근 검색어</h4>
              <ul>
                {recentSearch.length > 0 ? (
                  recentSearch.map((search, index) => (
                    <li key={index}>
                      {search}
                      <button
                        onClick={() =>
                          setRecentSearch((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
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

      <div className="functionArea">
        <img
          onClick={toggleAlarmModal}
          className="imges"
          src="/images/bell.png"
          alt="종모양"
        />
        <img
          onClick={() => navigate("/ContentWrite")}
          className="imges"
          src="/images/plus.png"
          alt="+"
        />
      </div>

      {isAlramOpen && (
        <AlarmComponent
          isOpen={isAlramOpen}
          closeAlarmModal={toggleAlarmModal}
        />
      )}
    </div>
  );
}

export default Header;
