import React, { useState } from "react";
import { useUserList } from "../../hook/useUserList";
import { useViewmodeChange } from "../../hook/useViewmodeChange";
import useSearchSubmit from "../../hook/useSearchSubmit";
import { useFilterMonitors } from "../../hook/useFilterMonitors";
import UserSearch from "./UserSearch";
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
        return user.role === "admin";
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
                <img
                  src={`/profileImage/${user.up_filename}`}
                  alt={`${user?.username} 이미지`}
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                />
                <span>{user?.tag_id}</span>
                <span>
                  {user?.username} / {user.is_admin?"admin":"user"}
                </span>
              </div>
            ))
          ) : (
            <div>유저 데이터가 없습니다.</div>
          )}
        </div>

        {/* 선택된 유저 ID를 AdminActions로 전달 */}
        <AdminActions selectedUserIds={selectedUserIds} />
      </div>

      <AdminFunction tag_id={managerTagId} uuid={managerUuid} />
    </div>
  );
}

export default UserList;
