// 채팅 관련 라우터
import ChatRoom from "../../Pages/chatingPage/ChatRoom";
import ChatingList from "../../Pages/chatingPage/ChatingList";

const ChatingRoutes = [
  {
    path: "/ChatingList",
    element: <ChatingList />,
  },
  {
    path: "/ChatRoom",
    element: <ChatRoom />,
  },
];
