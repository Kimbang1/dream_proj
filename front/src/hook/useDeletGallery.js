// useGalleryDelete.js - 삭제 기능 훅
import { useState } from "react";
import AxiosApi from "../servies/AxiosApi";

export const useGalleryDelete = () => {
  const [items, setItems] = useState([]); // 삭제 후 상태를 갱신하기 위한 아이템 상태

  const deleteGalleryItems = async (
    selectedIds,
    reason,
    manager,
    managerUuid
  ) => {
    if (!selectedIds.length) {
      alert("삭제할 게시물을 선택하세요.");
      return false;
    }
    if (!reason.trim()) {
      alert("삭제 사유를 입력하세요.");
      return false;
    }
    if (!reason.trim()) {
      alert("작성자 이름을 입력하세요");
      return false;
    }
    console.log(selectedIds);

    try {
      const dataToSend = selectedIds.map((linkId) => ({
        linkId, // id는 고유 식별자일 가능성 있음
        reason,
        manager, // 작성자 이름
        managerUuid,
      }));

      console.log(dataToSend);
      const response = await AxiosApi.post("/admin/contentDelete", dataToSend);
      if (response.status === 200) {
        alert("게시물이 삭제되었습니다.");
        // 삭제된 아이템을 제외하고 상태 업데이트
        setItems((prevItems) =>
          prevItems.filter((item) => !selectedIds.includes(item.linkId))
        );
        return true;
      }
    } catch (error) {
      console.error("게시물 삭제 실패: ", error);
      alert("삭제 실패. 다시 시도해 주세요.");
    }
    return false;
  };

  return { items, deleteGalleryItems };
};
