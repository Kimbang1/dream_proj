import React, { useState } from "react";
import AxiosApi from "../../servies/AxiosApi";

function AdminFunction() {
  const [manager, setManager] = useState(""); // 관리자 이름
  const [selectedOptions, setSelectedOptions] = useState([]); // 체크박스 선택 상태
  const [Reason, setReason] = useState("");
  const [Duration, setDuration] = useState("");
  const [blockAccount, setBlockAccount] = useState(false); // 계정 정지 여부
  const [deleteAccount, setDeleteAccount] = useState(false); // 계정 삭제 여부

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;

    if (value === "block") {
      setBlockAccount(checked);
    } else if (value === "delete") {
      setDeleteAccount(checked);
    } else {
      // Other duration checkboxes
      setSelectedOptions((prevSelected) =>
        checked
          ? [...prevSelected, value]
          : prevSelected.filter((option) => option !== value)
      );
    }
  };

  const handleBlockAction = async () => {
    const requestData = {
      action: blockAccount ? "block" : deleteAccount ? "delete" : "", // 계정 정지 또는 삭제 처리
      manager: manager,
      reason: Reason,
      duration: Duration || selectedOptions.join(", "), // 기간 값
    };

    // requestData 출력
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
              type="checkbox"
              value="block"
              checked={blockAccount}
              onChange={handleCheckboxChange}
            />
            <div className="spanArea">
              <span>계정 정지</span>
            </div>
          </div>
          <div className="Sb ClearArea">
            <input
              type="checkbox"
              value="delete"
              checked={deleteAccount}
              onChange={handleCheckboxChange}
            />
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

  );
}

export default AdminFunction;
