/*관리자용 회원 목록 페이지,계정 정지/삭제 페이지,관리자용 게시물 목록
 */

import UserList from "../../Pages/AdminPage/UserList";
import GalleryList from "../../Pages/AdminPage/GalleryList";
import Manager from "../../Pages/AdminPage/Manager";
const AdminRoutes = [

  {
    path:"/Manager",
    element : <Manager/>,
  },
  {
    path: "/UserList",
    element: <UserList />,
  },
  {
    path: "/GalleryList",
    element: <GalleryList />,
  },
];

export default AdminRoutes;
