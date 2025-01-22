import React, { useState } from "react";
import { useUserList } from "../../hook/useUserList";
import { useViewmodeChange } from "../../hook/useViewmodeChange";
//여기 뷰모드체인지에서 관리자인지 아닌지 받아옵니다
import useSearchSubmit from "../../hook/useSearchSubmit";
import { useFilterMonitors } from "../../hook/useFilterMonitors";
import UserSearch from "./UserSearch"; //유저 검색
import AdminActions from "./AdminAction";
import AdminFunction from "./AdminFunction";

function UserList() {
  const { users, loading, hasMore, setPage, managerTagId, managerUuid } =
    useUserList();
  const [searchMonitor, setSearchMonitor] = useState(""); // 검색어 상태
  const { viewMode, handleViewChange } = useViewmodeChange();
  const { handleSearchSubmit } = useSearchSubmit();

  const { filteredMonitors } = useFilterMonitors(users, searchMonitor);

  // 선택된 유저 ID 상태 관리
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  console.log("Filtered Monitors: ", filteredMonitors);

  const filteredUsers = filteredMonitors
    .filter((user) => {
      if (viewMode === "admin") {
        return user.role === "admin"; // 관리자일 때만 필터링
      }
      return true;
    })
    .map((user) => {
      console.log("User object: ", user);
      return {
        ...user,
        username: user?.username || "No Name",
        tag_id: user?.tag_id || "No Tag",
      };
    });

  // 유저 선택 토글 함수
  const toggleUserSelection = (userId) => {
    setSelectedUserIds(
      (prevSelected) =>
        prevSelected.includes(userId)
          ? prevSelected.filter((id) => id !== userId) // 선택 해제
          : [...prevSelected, userId] // 선택 추가
    );
  };

  return (
    <div className="UserListframe">
      <div className="listView">
        {/* 유저 검색창 */}
        <UserSearch
          handleSearchSubmit={(e) =>
            handleSearchSubmit(e, searchMonitor, setSearchMonitor)
          }
          searchMonitor={searchMonitor}
          setSearchMonitor={setSearchMonitor}
        />

        <div className="BtnfunctionArea">
          <button
            className="triplets AlluserLsit"
            onClick={() => handleViewChange("all")}
          >
            회원전체 보기
          </button>
          <button
            className="triplets onlyAdmin"
            onClick={() => handleViewChange("admin")}
          >
            관리자 보기
          </button>
        </div>

        <div className="ListBox">
          {loading ? (
            <div>로딩 중...</div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user.uuid} className="userItem">
                <input
                  type="checkbox"
                  value={user.uuid}
                  checked={selectedUserIds.includes(user.uuid)}
                  onChange={() => toggleUserSelection(user.uuid)}
                />
                <div className="userInfoArea">
                  <img
                    className="profileImg"
                    src={`/profileImage/${user.up_filename}`}
                    alt={`${user?.username} 이미지`}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                  <div className="userReftArea">
                    <span>tag_id: {user?.tag_id}</span>
                    <span className="userStatus">
                      {user?.username} / {user.is_admin ? "admin" : "user"} /
                      정지상태: {user.is_using ? "false" : "true"} / 신고 횟수:{" "}
                      {user.suspended_cnt}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>유저 데이터가 없습니다.</div>
          )}
        </div>

        {/* 선택된 유저 ID를 AdminActions로 전달 */}
        <AdminActions selectedUserIds={selectedUserIds} />
      </div>

      <AdminFunction
        tag_id={managerTagId}
        uuid={managerUuid}
        selectedUserIds={selectedUserIds}
      />
    </div>
  );
}

export default UserList;
