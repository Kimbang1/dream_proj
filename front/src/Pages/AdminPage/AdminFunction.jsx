import React, { useState } from "react";
import AxiosApi from "../../servies/AxiosApi";

function AdminFunction({ tag_id, uuid, selectedUserIds }) {
  console.log("**********");
  console.log("태그 ID:", tag_id);
  console.log("UUID:", uuid);
  console.log("**********");

  const [manager, setManager] = useState(""); // 관리자 이름
  const [selectedStopOption, setSelectedStopOption] = useState(""); // StopList 단일 선택
  const [Reason, setReason] = useState("");
  const [Duration, setDuration] = useState("");
  const [blockAccount, setBlockAccount] = useState(false); // 계정 정지 여부
  const [deleteAccount, setDeleteAccount] = useState(false); // 계정 삭제 여부

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === "action") {
      // 계정 정지/삭제 Radio 버튼
      if (value === "block") {
        setBlockAccount(checked ? true : false);
        setDeleteAccount(false);
      } else if (value === "delete") {
        setDeleteAccount(checked ? true : false);
        setBlockAccount(false);
      }
    } else if (name === "stopList") {
      // StopList 단일 선택
      setSelectedStopOption((prev) => (prev === value ? "" : value));
    }
  };

  const handleBlockAction = async () => {
    const requestData = {
      action: blockAccount ? "block" : deleteAccount ? "resign" : "", // 계정 정지 또는 삭제 처리
      manager: manager,
      managerUuid: uuid,
      reason: Reason,
      selectedUserIds: selectedUserIds,
      duration: Duration || selectedStopOption.join(", "), // 기간 값
    };

    console.log("전송할 데이터:", requestData);

    try {
      const response = await AxiosApi.post("/admin/userProc", requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const result = response.data;
        console.log("계정 처리 성공:", result);
        alert("선택한 계정 정지/삭제에 성공했습니다.");
      } else {
        console.error("계정 처리 실패:", response.statusText);
      }
    } catch (error) {
      console.error("계정 처리 중 오류 발생:", error);
    }
  };

  return (
    <div className="AdminfunctionArea">
      {/* 오른쪽 관리자 작업 */}
      <div className="checkBoxArea">
        <div className="Sb StopArea">
          <input
            type="radio"
            name="action"
            value="block"
            checked={blockAccount}
            onChange={handleCheckboxChange}
            disabled={!tag_id} // 유저 선택이 없으면 비활성화
          />
          <div className="spanArea">
            <span>계정 정지</span>
          </div>
        </div>
        <div className="Sb ClearArea">
          <input
            type="radio"
            name="action"
            value="delete"
            checked={deleteAccount}
            onChange={handleCheckboxChange}
            disabled={!tag_id} // 유저 선택이 없으면 비활성화
          />
          <div className="spanArea">
            <span>계정 삭제</span>
          </div>
        </div>
      </div>
      <div className="AdminNameArea">
        <h3>{tag_id ? `${tag_id}` : "관리자가 아닙니다."}</h3>
      </div>

      <div className="RealName">
        <input
          className="RealWriterName"
          type="text"
          placeholder="작성의 이름을 쓰세요."
          value={manager}
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
          <input
            type="radio"
            name="stopList"
            value="15"
            onChange={handleCheckboxChange}
            checked={selectedStopOption === "15"}
          />
          <div className="List">정지 15일</div>
        </div>
        <div className="stopLsit">
          <input
            type="radio"
            name="stopList"
            value="30"
            onChange={handleCheckboxChange}
            checked={selectedStopOption === "30"}
          />
          <div className="List">정지 30일</div>
        </div>
        <div className="stopLsit">
          <input
            type="radio"
            name="stopList"
            value="90"
            onChange={handleCheckboxChange}
            checked={selectedStopOption === "90"}
          />
          <div className="List">정지 90일</div>
        </div>
        <div className="stopLsit">
          <input
            type="radio"
            name="stopList"
            value="custom"
            onChange={handleCheckboxChange}
            checked={selectedStopOption === "custom"}
          />
          <input
            id="giganArea"
            type="text"
            placeholder="기간을 입력해주세요"
            onChange={(e) => setDuration(e.target.value)}
            value={Duration}
            disabled={selectedStopOption !== "custom"}
          />
        </div>
      </div>
      <div className="executionArea">
        <button className="execution" onClick={handleBlockAction}>
          실행
        </button>
      </div>
    </div>
  );
}

export default AdminFunction;
