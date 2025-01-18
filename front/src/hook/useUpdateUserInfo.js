// hooks/useUpdateUserInfo.js
import { useState } from "react";
import AxiosApi from "../servies/AxiosApi";

export const useUpdateUserInfo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateUserInfo = async (userInfo) => {
    try {
      setIsLoading(true);
      await AxiosApi.put("/user/update", userInfo);
      setIsLoading(false);
      alert("수정 완료!");
    } catch (err) {
      setIsLoading(false);
      setError(err);
      alert("수정 실패!");
    }
  };

  return {
    isLoading,
    error,
    updateUserInfo,
  };
};
