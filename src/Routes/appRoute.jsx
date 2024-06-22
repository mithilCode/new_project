import Assign from "../Views/assign/Assign";
import Login from "../Views/auth/Login";
import Farm from "../Views/farm/Farm";
import Plant from "../Views/plant/Plant";
import Report from "../Views/report/Report";
import User from "../Views/user/User";

export const appRoute = [
  {
    path: "/login",
    element: <Login />,
    isPublic: true,
  },
  {
    path: "/",
    element: <User />,
    isPublic: false,
  },
  {
    path: "/farm",
    element: <Farm />,
    isPublic: false,
  },
  {
    path: "/plant",
    element: <Plant />,
    isPublic: false,
  },
  {
    path: "/report",
    element: <Report />,
    isPublic: false,
  },
  {
    path: "/assign",
    element: <Assign />,
    isPublic: false,
  },
];
