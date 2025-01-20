// 채팅 관련 라우터
import ChatRoom from "../../Pages/chatingPage/ChatRoom";
import ChatingList from "../../Pages/chatingPage/ChatingList";
import ChatingPage from "../../Pages/chatingPage/ChatingPage";

const ChatingRoutes = [
  {
    path: "/ChtingPage",
    element: <ChatingPage />,
  },
  {
    path: "/ChatingList",
    element: <ChatingList />,
  },
  {
    path: "/ChatRoom/:chatId",
    element: <ChatRoom />,
  },
];

export default ChatingRoutes;
