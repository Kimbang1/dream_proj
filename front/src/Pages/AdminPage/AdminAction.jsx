import React from "react";
import AxiosApi from "../../servies/AxiosApi";

const AdminActions = ({ selectedUserIds }) => {
  console.log("selectedUserIds: ", selectedUserIds);
  // Admin registration logic
  const AdminRegistration = async () => {
    try {
      const response = await AxiosApi.post(
        "/admin/regAdmin",
        {
          headers: { "Content-Type": "application/json" },
          selectedUserIds,
        }
      );

      // Check if the response is successful
      if (response.status === 200) {
        const result = response.data;
        console.log("관리자 등록 성공:", result);
      } else {
        console.error("관리자 등록 실패:", response.statusText);
      }
    } catch (error) {
      console.error("관리자 등록 중 오류 발생:", error);
    }
  };

  // Admin  해제 로직
  const AdminRelease = async () => {
    try {
      const response = await AxiosApi.post(
        "/admin/clearAdmin",
        {
          headers: {
            "Content-Type": "application/json",
          },
          selectedUserIds, // Send selected user IDs as part of the request
        },
      );

      // Check if the response is successful
      if (response.status === 200) {
        const result = response.data;
        console.log("관리자 해제 성공:", result);
      } else {
        console.error("관리자 해제 실패:", response.statusText);
      }
    } catch (error) {
      console.error("관리자 해제 중 오류 발생:", error);
    }
  };

  return (
    <div className="AdminCommitClear">
      <button className="twins Commit" onClick={AdminRegistration}>
        관리자 등록
      </button>
      <button className="twins Clear" onClick={AdminRelease}>
        관리자 해제
      </button>
    </div>
  );
};

export default AdminActions;
