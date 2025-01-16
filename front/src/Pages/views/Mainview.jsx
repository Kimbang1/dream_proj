import React, { useState, useEffect } from "react";

import ViewChoice from "../../componunts/layout/ViewChoice";
import AxiosApi from "../../servies/AxiosApi";

function Mainview({ setIsMainPage }) {

  return (
    <>
      {/* //프로필 페이지가 아닐때만 렌더링 */}
      <div className="ChoiceBtn">
        <ViewChoice setIsMainPage={true} />
      </div>
    </>
  );
}

export default Mainview;
