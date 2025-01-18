import React from "react";

function UserSearch({ handleSearchSubmit, searchMonitor, setSearchMonitor }) {
  return (
    <div className="UserSearchArea">
      <form onSubmit={(e) => handleSearchSubmit(e)}>
        <input
          className="AdminUseSearch"
          type="text"
          placeholder="회원 검색"
          value={searchMonitor} // 검색어 상태 바인딩
          onChange={(e) => setSearchMonitor(e.target.value)} // 입력 시 상태 업데이트
        />
        <img id="dodbogi" src="/images/dodbogi.png" alt="돋보기" />
      </form>
    </div>
  );
}

export default UserSearch;
