import { useMemo } from "react";

export function useFilterMonitors(users, searchMonitor) {
  console.log("Users: ", users); // users 배열 확인
  console.log("Search Monitor: ", searchMonitor); // 검색어 확인

  const filteredMonitors = useMemo(() => {
    // const flatUsers = users.flat();

    if (!users || users.length === 0) return [];

    // 검색어가 있으면 그에 맞게 필터링
    return users.filter((user) =>
      (user?.username || "").toLowerCase().includes(searchMonitor.toLowerCase())
    );
  }, [users, searchMonitor]);

  return { filteredMonitors };
}
