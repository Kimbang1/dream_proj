/*알람페이지, 검색페이지 게시물(모바일/태블릿),검색 결과 페이지(게시물/계정),
  댓글페이지,이용약관페이지, 신고페이지*/

import Mainview from "../../Pages/views/Mainview";
import ContentWrite from "../../Pages/views/ContentWrite";
import Gallery from "../../Pages/views/Gallery";
import Post from "../../Pages/views/Post";
import SearchRes from "../../Pages/views/SearchRes";
import Map from "../../componunts/NaverMap/Map";

const pageRoutes = [
  {
    path: "/*",
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
  {
    path: "/SearchRes",
    element: <SearchRes />,
  },
  {
    path: "/Map",
    element: <Map />,
  },
];

export default pageRoutes;
