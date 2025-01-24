import React, { useState, useEffect } from "react";

import ViewChoice from "../../componunts/layout/ViewChoice";
import { WidthFull } from "@mui/icons-material";
import { height } from "@mui/system";


function Mainview() {

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
