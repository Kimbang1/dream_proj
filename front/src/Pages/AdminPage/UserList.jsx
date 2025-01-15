import React, { useRef, useState } from "react";
import { useUserList } from "../../hook/useUserList";
import { useInfiniteScroll } from "../../hook/useInfiniteScroll";
import { useViewmodeChange } from "../../hook/useViewmodeChange";
import useSearchSubmit from "../../hook/useSearchSubmit";
import useFilterMonitors from "../../hook/useFilterMonitors";
import AxiosApi from "../../servies/AxiosApi";

function UserList() {
  const inputRef = useRef(null);
  const { users, loading, hasMore, setPage } = useUserList();
  const [manager, setManager] = useState(""); // 작성자 이름 상태
  const { viewMode, handleViewChange } = useViewmodeChange();
  const [selectedOptions, setSelectedOptions] = useState([]); // 선택된 체크박스 값 관리
  const [Reason, setReason] = useState("");
  const [Duration, setDuration] = useState("");
  const { searchMonitor, setSearchMonitor, handleSearchSubmit } =
    useSearchSubmit();
  const { filteredMonitors } = useFilterMonitors([], searchMonitor);

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    setSelectedOptions(
      (prevSelected) =>
        isChecked
          ? [...prevSelected, value] // 체크된 경우 값 추가
          : prevSelected.filter((option) => option !== value) // 체크 해제된 경우 값 제거
    );
  };

  const handleBlockAction = async () => {
    const requestData = {
      action: "block",
      manager: manager,
      reason: Reason,
      duration: Duration || selectedOptions.join(", "), // 기간 값
    };

    try {
      const response = await fetch("/api/block", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("계정 정지 성공:", result);
      } else {
        console.error("계정 정지 실패:", response.statusText);
      }
    } catch (error) {
      console.error("계정 정지 중 오류 발생:", error);
    }
  };

  const handleResignAction = async () => {
    const requestData = {
      action: "Resign",
      manager: manager,
    };

    try {
      const response = await fetch("/api/resign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("계정 삭제 성공:", result);
      } else {
        console.error("계정 삭제 실패:", response.statusText);
      }
    } catch (error) {
      console.error("계정 삭제 중 오류 발생:", error);
    }
  };

  useInfiniteScroll(hasMore, loading, setPage);

  const filteredUsers = users.filter((user) => {
    if (viewMode === "admin") {
      return user.role === "admin";
    }
    return true;
  });

  return (
    <div className="UserListframe">
      <div className="listView">
        <div className="UserSearchArea" ref={inputRef}>
          <form onSubmit={handleSearchSubmit}>
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
        <div className="BtnfunctionArea">
          <button
            className="triplets AlluserLsit"
            onClick={() => handleViewChange("all")}
          >
            회원 전체 보기
          </button>
          <button
            className="triplets onlyAdmin"
            onClick={() => handleViewChange("admin")}
          >
            관리자들만 보기
          </button>
        </div>
        <div className="ListBox">
          {loading ? (
            <div>로딩 중...</div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user.id} className="userItem">
                <input type="checkbox" />
                <img
                  src={user.image}
                  alt={`${user.name} 이미지`}
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                />
                <span>
                  {user.name} / {user.role}
                </span>
              </div>
            ))
          ) : (
            <div>유저 데이터가 없습니다.</div>
          )}
        </div>
      </div>
      <div className="AdminfunctionArea">
        <div className="checkBoxArea">
          <div className="Sb StopArea">
            <input type="checkBox" />
            <div className="spanArea">
              <span>계정 정지</span>
            </div>
          </div>
          <div className="Sb ClearArea">
            <input type="checkBox" />
            <div className="spanArea">
              <span>계정 삭제</span>
            </div>
          </div>
        </div>
        <div className="AdminNameArea">
          <h3>관리자 이름</h3>
        </div>
        <div className="RealName">
          <input
            className="RealWriterName"
            type="text"
            placeholder="작성의 이름을 쓰세요."
            value={manager} // 작성자 이름 상태값
            onChange={(e) => setManager(e.target.value)}
          />
        </div>
        <div className="stopreason">
          <input
            type="text"
            maxLength={80}
            placeholder="사유를 입력하세요"
            value={Reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <div className="stopListArea">
          <div className="stopLsit">
            <input type="checkbox" value={15} onChange={handleCheckboxChange} />
            <div className="List">정지 15일</div>
          </div>
          <div className="stopLsit">
            <input type="checkbox" value={30} onChange={handleCheckboxChange} />
            <div className="List">정지 30일</div>
          </div>
          <div className="stopLsit">
            <input type="checkbox" value={90} onChange={handleCheckboxChange} />
            <div className="List">정지 90일</div>
          </div>
          <div className="stopLsit">
            <input type="checkbox" />
            <input
              id="giganArea"
              type="text"
              placeholder="기간을 입력해주세요"
              onChange={(e) => setDuration(e.target.value)}
              value={Duration}
            />
          </div>
        </div>
        <div className="executionArea">
          <button className="execution" onClick={handleBlockAction}>
            실행
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserList;
