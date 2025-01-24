import React, { useState, useEffect } from "react";
import AxiosApi from "../../servies/AxiosApi";

export const useChatRooms = () => {
  const [chatRooms, setChatRooms] = useState([]); //유저가 포함된 채팅방 리스트
  const [userTagId, setUserTagId] = useState(null); //유저의 tag_id
  const [loading, setLoading] = useState(true); //로딩 상태
  const [error, setError] = useState(null);

  useEffect(() => {
    //유저 정보 및 데이터 가져오기
    const fetchChatRooms = async () => {
      try {
        setLoading(true);
        setError(null);

        //유저 정보 가져오기
        const userResponse = await AxiosApi.get(`/user/info?uuid=${uuid}`);
        const { uuid, tag_id } = userResponse.data; //유저의Uuid, tag_id
        console.log("uuid의 값:", userResponse.data.uuid);
        setUserTagId(tag_id);

        //유저가 포함된 채팅방 가져오기
        const chatRoomsResponse = await AxiosApi.get(`/user/chatrooms`, {
          params: { uuid }, //Api에 uuid를 요청?하는걸 포함
        });

        setChatRooms(chatRoomsResponse.data); //채팅방 데이터 설정
      } catch (err) {
        setError(err);
        console.log("채팅방 데이터를 가져오는중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChatRooms();
  }, []);
  return { chatRooms, userTagId, loading, error };
};
