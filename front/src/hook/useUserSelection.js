import React from "react";

export const useUserSelection = () => {
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const handleUserSelect = (tagId) => {
    setSelectedUserIds((preveSelectedIds) => {
      if (preveSelectedIds.includes(tagId)) {
        return preveSelectedIds.filter((id) => id !== tagId); //이미 선택된 경우에는 제거
      } else {
        return [...preveSelectedIds.tagId]; //선택되지 않은 경우 추가
      }
    });
  };

  return {
    selectedUserIds,
    handleUserSelect,
  };
};
