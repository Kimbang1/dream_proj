// hooks/useUserInfo.js
import { useState, useEffect } from "react";
import AxiosApi from "../servies/AxiosApi";

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState({
    tag_id: "",
    username: "",
    introduce: "",
    phone: "",
    profile_image: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await AxiosApi.get("/user/leftBar");
        const data = response.data;
        setUserInfo({
          tag_id: data?.user?.tag_id || "",
          username: data?.user?.username || "",
          introduce: data?.user?.introduce || "",
          phone: data?.user?.phone || "",
          profile_image: data?.profile_image || "",
        });
      } catch (error) {
        console.error("유저 정보를 가져오지 못했습니다.:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  return {
    userInfo,
    handleChange,
  };
};
