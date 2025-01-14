// hooks/useUserInfo.js
import { useState, useEffect } from "react";
import AxiosApi from "../servies/AxiosApi";

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState({
    tag_id: "",
    username: "",
    introduce: "",
    phone: "",
    profileImage: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await AxiosApi.get("/user/info");
        const data = response.data;
        setUserInfo({
          tag_id: data.tag_id || "",
          username: data.username || "",
          introduce: data.introduce || "",
          phone: data.phone || "",
          profileImage: data.profileImage || "",
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
