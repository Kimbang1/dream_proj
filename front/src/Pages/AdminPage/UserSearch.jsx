import React from "react";

function UserSearch({ handleSearchSubmit, searchMonitor, setSearchMonitor }) {
  return (
    <div className="UserSearchArea">
      <form onSubmit={(e) => handleSearchSubmit(e, searchMonitor)}>
        <input
          className="AdminUseSearch"
          type="text"
          placeholder="회원 검색"
          value={searchMonitor}
          onChange={(e) => setSearchMonitor(e.target.value)}
        />
        <img id="dodbogi" src="/images/dodbogi.png" alt="돋보기" />
      </form>
    </div>
  );
}

export default UserSearch;
