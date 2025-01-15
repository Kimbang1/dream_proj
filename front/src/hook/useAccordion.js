// useAccordion.js
import { useState } from "react";

const useAccordion = () => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const toggleAccordion = (e) => {
    if (!isAccordionOpen) setIsAccordionOpen(true);
  };

  const closeAccordion = () => {
    setIsAccordionOpen(false);
  };

  return { isAccordionOpen, toggleAccordion, closeAccordion };
};

export default useAccordion;
