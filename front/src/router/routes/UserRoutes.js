/*회원(user)페이지,회원정보 수정페이지,회원탈퇴 페이지,
회원페이지 갤러리식/포스트식, 게시글 작성페이지,게시글 상세페이지, */

import UserMainpage from "../../componunts/user/UserMainpage";
import UserGallery from "../../componunts/user/UserGallery";
import UserPost from "../../componunts/user/UserPost";
import Useredit from "../../componunts/user/UsereditProfile";

const userRoutes = [
  {
    path: "/user/*",
    element: <UserMainpage />, // component -> element로 수정
    children: [
      {
        path: "UserGallery",
        element: <UserGallery />, // component -> element로 수정
      },
      {
        path: "UserPost",
        element: <UserPost />, // component -> element로 수정
      },
    ],
  },
  {
    path: "/user/Useredit",
    element: <Useredit />,
  },
];

export default userRoutes;
