/*관리자용 회원 목록 페이지,계정 정지/삭제 페이지,관리자용 게시물 목록
 */

import UserList from "../../Pages/AdminPage/UserList";
import PostList from "../../Pages/AdminPage/PostList";

const AdminRoutes = [
  {
    path: "/UserList",
    element: <UserList />,
  },
  {
    path: "/PostList",
    element: <PostList />,
  },
];

export default AdminRoutes;
