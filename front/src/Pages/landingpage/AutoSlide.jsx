import React, { useEffect, useState } from "react";

function AutoSlide({ images, intervalTime }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalld = setInterval(() => {
      setCurrentIndex((currentIndex + 1) % images.length);
    }, intervalTime);

    return () => clearInterval(intervalld);
  }, [currentIndex, images.length, intervalTime]);
  return (
    <div>
      <img
        src={images[currentIndex]}
        alt={`slide${currentIndex + 1}`}
        style={{ width: "100%", objectFit: "cover" }}
      />
    </div>
  );
}

export default AutoSlide;
