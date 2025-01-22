import { useState, useEffect } from "react";
import AxiosApi from "../servies/AxiosApi";

export const useUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // 페이지 번호
  const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터가 있는지 여부
  const [managerTagId, setManagerTagId] = useState(null);
  const [managerUuid, setManagerUuid] = useState(null);

  const fetchUsers = async (page) => {
    try {
      setLoading(true);
      const response = await AxiosApi.get(`/admin/userList?page=${page}`);
      if (Array.isArray(response.data.userList)) {
        setUsers((prevUsers) => {
          const newUsers = response.data.userList;
          // 기존 users와 새로운 users 데이터를 합칠 때 중복을 제거
          const uniqueUsers = [
            ...prevUsers,
            ...newUsers.filter(
              (newUser) => !prevUsers.some((user) => user.uuid === newUser.uuid)
            ),
          ];
          return uniqueUsers;
        });
        setManagerTagId(response.data.managerTagId);
        setManagerUuid(response.data.managerUuid);
        if (response.data.userList.length === 0) {
          setHasMore(false); // 더 이상 가져올 데이터가 없으면 false
        }
      } else {
        console.log("Api 응답이 배열이 아닙니다.", response.data);
        setHasMore(false); // 비정상 데이터 처리
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

  return { users, loading, hasMore, setPage, managerTagId, managerUuid };
};
