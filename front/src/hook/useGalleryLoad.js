// useGalleryFetch.js - 데이터 가져오는 훅
import { useState, useRef, useEffect } from "react";
import AxiosApi from "../servies/AxiosApi";

export const useGalleryLoad = () => {
  const [items, setItems] = useState([]); // 아이템 목록 상태
  const [page, setPage] = useState(1); // 페이지 번호 상태
  const [loading, setLoading] = useState(false); // 로딩 상태
  const loader = useRef(null); // Intersection Observer를 위한 ref

  // 데이터 가져오는 함수
  const fetchGalleryItems = async () => {
    if (loading) return; // 중복 호출 방지
    setLoading(true);

    try {
      const response = await AxiosApi.get(`/contents/galleryView?page=${page}`);
      const newItems = response.data;

      // 중복된 아이템을 제거하여 상태 업데이트
      setItems((prevItems) => {
        const existingLinkIds = prevItems.map((item) => item.linkId);
        const filteredNewItems = newItems.filter(
          (item) => !existingLinkIds.includes(item.linkId)
        );
        return [...prevItems, ...filteredNewItems];
      });

      // 페이지 번호 증가
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("데이터 로드 실패: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  // Intersection Observer 초기화
  useEffect(() => {
    if (!loader.current) return;

    const currentLoader = loader.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchGalleryItems(); // 스크롤 끝에 도달하면 데이터 로드
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [loader]);

  return { items, fetchGalleryItems, loader };
};
