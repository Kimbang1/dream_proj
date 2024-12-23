import React, { useState } from "react";


function Header() {
  const [searchMonitor, setSearchMonitor] = useState(""); // 검색어 상태 관리

  // 검색 대상 데이터 배열
  const monitorsData =[]

  // 검색어 변경 이벤트 핸들러
  const onChange = (e) => {
    setSearchMonitor(e.target.value); // 입력 값을 상태로 저장
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
        <form action="">
          <div className="dodbogiArea">
            <img src="/images/dodbogi.png" alt="돋보기" />
          </div>

          <input
            type="text"
            className="search"
            placeholder="검색할 내용을 적어주세요"
            value={searchMonitor}
            onChange={onChange}
          />
        </form>
      </div>

      <div className="functionArea">
        <img className="imges" src="/images/bell.png" alt="종모양" />
        <img className="imges" src="/images/+.png" alt="+" />
      </div>
    </div>
  );
}

export default Header;
