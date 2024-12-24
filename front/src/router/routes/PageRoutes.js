/*알람페이지, 검색페이지 게시물(모바일/태블릿),검색 결과 페이지(게시물/계정),
  댓글페이지,이용약관페이지, 신고페이지*/
import Landing from "../../Pages/landingpage/Landing";
import Mainview from "../../Pages/Mainview";
import join from "../../Pages/Join";
import Login from "../../Pages/Login";

const pageRoutes = [
  {
    path: "/",
    component: Landing,
  },
  {
    path: "/mainview",
    component: Mainview,
  },
  {
    path: "/join",
    component: join,
  },
  {
    path: "/login",
    component: Login,
  },
];

export default pageRoutes;
