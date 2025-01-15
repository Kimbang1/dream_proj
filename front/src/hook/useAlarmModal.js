// useAlarmModal.js
import { useState } from "react";

const useAlarmModal = () => {
  const [isAlramOpen, setIsAlramOpen] = useState(false);

  const toggleAlarmModal = () => {
    setIsAlramOpen((prev) => !prev);
  };

  return { isAlramOpen, toggleAlarmModal };
};

export default useAlarmModal;
