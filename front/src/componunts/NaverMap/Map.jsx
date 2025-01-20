// Map.jsx
import React, { useEffect, useState } from "react";
import MapWithPhotos from "./PhothOfCoordinate";

const Map = ({ photoData }) => {
  return (
    <div className="Mapview">
      {/* MapWithPhotos 컴포넌트를 렌더링하고, photoData를 전달 */}
      <MapWithPhotos photoData={photoData} />
    </div>
  );
};

export default Map;
