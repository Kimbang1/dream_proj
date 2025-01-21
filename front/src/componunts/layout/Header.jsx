import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import AlarmComponent from "../modal/AlramModal";
import useAccordion from "../../hook/useAccordion";
import useSearchSubmit from "../../hook/useSearchSubmit";
import { useFilterMonitors } from "../../hook/useFilterMonitors";
import useClickOutside from "../../hook/useClickOutside";
import useAlarmModal from "../../hook/useAlarmModal";

function Header() {
  const monitorsData = [];
  const inputRef = useRef(null);

  const { isAccordionOpen, toggleAccordion, closeAccordion } = useAccordion();
  const {
    searchMonitor,
    setSearchMonitor,
    handleSearchSubmit,
    handleSearchClick,
    recentSearch,
    setRecentSearch,
  } = useSearchSubmit();

  const { filteredMonitors } = useFilterMonitors(monitorsData, searchMonitor);

  useClickOutside(inputRef, closeAccordion);

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
            onFocus={() => toggleAccordion()}
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
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => handleSearchClick(search)}
                      >
                        {search}
                      </span>
                      <button
                        onClick={() =>
                          setRecentSearch((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                        style={{ marginLeft: "10px", cursor: "pointer" }}
                      >
                        &times;
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
