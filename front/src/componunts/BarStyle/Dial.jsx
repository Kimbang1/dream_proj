import * as React from "react";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";

const actions = [
  {
    icon: (
      <img src="/images/map.png" alt="지도" style={{ width: 24, height: 24 }} />
    ),
    name: "지도",
  },
  {
    icon: (
      <img
        src="/images/bell.png"
        alt="알림"
        style={{ width: 24, height: 24 }}
      />
    ),
    name: "알림",
  },
  {
    icon: (
      <img
        src="/images/chating.png"
        alt="채팅"
        style={{ width: 24, height: 24 }}
      />
    ),
    name: "채팅",
  },
  {
    icon: (
      <img
        src="/images/whale.png"
        alt="whales bot"
        style={{ width: 24, height: 24 }}
      />
    ),
    name: "whales bot",
  },
  {
    icon: (
      <img
        src="/images/manager.png"
        alt="관리자 사진"
        style={{ width: 24, height: 24 }}
      />
    ),
  },
];

export default function Dial() {
  return (
    <Box sx={{ height: 320, transform: "translateZ(0px)", flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "absolute", top: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        direction="down"
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}
