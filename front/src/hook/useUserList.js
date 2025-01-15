import React, { useEffect, useState } from "react";
import AxiosApi from "../servies/AxiosApi";

export const useUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); //페이지 번호
  const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터가 있는지 여부

  const fetchUsers = async (page) => {
    try {
      setLoading(true);
      const response = await AxiosApi.get(`/user/info?page=${page}`);
      if (Array.isArray(response.data)) {
        setUsers((prevUsers) => [...prevUsers, response.data]); //새로운 유저 데이터
        if (response.data.length === 0) {
          setHasMore(false); //가져올 데이터가 더이상 없으면 false
        }
      } else {
        console.log("Api 응답이 배열이 아닙니다.", response.data);
        setHasMore(false); //비정상 데이터도 가져올 데이터가 없다고 처리
      }
    } catch (error) {
      console.error("불러올 유저리스트가 없습니다.", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  return { users, loading, hasMore, setPage };
};
