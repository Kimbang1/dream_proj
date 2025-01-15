import React, { useEffect } from "react";

export const useInfiniteScroll = (hasMore, loading, setPage) => {
  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return; // 로딩 중이거나 더 이상 데이터가 없으면 스크롤 이벤트를 하지 않음
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        setPage((prevPage) => prevPage + 1); // 스크롤 끝에 도달하면 다음 페이지로
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore, loading, setPage]);
};
