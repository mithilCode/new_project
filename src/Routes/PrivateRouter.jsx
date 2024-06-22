import { Navigate, useNavigate } from "react-router-dom";
import { getAuthToken } from "../Helper/AuthTokenHelper";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setIsLogin } from "../Redux/reducers/auth.slice";

/* eslint-disable react/prop-types */
const PrivateRouter = ({ children }) => {
  let UserPreferences = getAuthToken();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  axios.interceptors.response.use((successRes) => {
    if (successRes.data?.ResponseCode === 6) {
      localStorage.clear();
      dispatch(setIsLogin(false));
      navigate("/login");
    }

    return successRes;
  });

  if (UserPreferences) {
    return <div>{children}</div>;
  } else {
    return <Navigate to="/login" replace={true} />;
  }
};

export default PrivateRouter;
