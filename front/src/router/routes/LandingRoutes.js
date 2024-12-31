import Landing from "../../Pages/landingpage/Landing";
import Join from "../../Pages/views/Join";
import Login from "../../Pages/views/Login";
import Jopinchoice from "../../Pages/views/Joinchoice";
import Agree from "../../Pages/views/Agree";

const LandingRoutes = [
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/Agree",
    element: <Agree />,
  },
  {
    path: "/join",
    element: <Join />,
  },
  {
    path: "/joinchoice",
    element: <Jopinchoice />,
  },
  {
    path: "/login",
    element: <Login />,
  },
];

export default LandingRoutes;
