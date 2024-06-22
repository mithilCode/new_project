/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { getAuthToken } from "../Helper/AuthTokenHelper";
const PublicRouter = ({ children }) => {
  const UserPreferences = getAuthToken();

  if (!UserPreferences) {
    return <div>{children}</div>;
  } else {
    return <Navigate to="/" replace={true} />;
  }
};

export default PublicRouter;
