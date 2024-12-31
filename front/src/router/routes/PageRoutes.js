/*알람페이지, 검색페이지 게시물(모바일/태블릿),검색 결과 페이지(게시물/계정),
  댓글페이지,이용약관페이지, 신고페이지*/

import Mainview from "../../Pages/views/Mainview";
import ContentWrite from "../../Pages/views/ContentWrite";
import Gallery from "../../Pages/views/Gallery";
import Post from "../../Pages/views/Post";

const pageRoutes = [
  {
    path: "/mainview",
    element: <Mainview />,
  },
  {
    path: "/ContentWrite",
    element: <ContentWrite />,
  },
  {
    path: "/Gallery",
    element: <Gallery />,
  },
  {
    path: "/Post",
    element: <Post />,
  },
];

export default pageRoutes;
