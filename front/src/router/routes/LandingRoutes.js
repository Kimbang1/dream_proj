import Landing from "../../Pages/landingpage/Landing";
import Join from "../../Pages/views/Join";
import Login from "../../Pages/views/Login";

const LandingRoutes = [
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/join",
    element: <Join />,
  },
  {
    path: "/login",
    element: <Login />,
  },
];

export default LandingRoutes;
