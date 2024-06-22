import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuthToken, setAuthToken } from '../Helper/AuthTokenHelper';
import { API_BASE_URL } from './constant';
import { setIsLogin } from '../Redux/reducers/auth.slice';

const AuthHandler = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = getAuthToken();

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      dispatch(setIsLogin(true));
    }

    axios.defaults.baseURL = API_BASE_URL;
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        // navigate('/login');
        // localStorage.clear()
        console.error('error', error);
        return Promise.reject(error);
      }
    );
  }, [dispatch, navigate, token]);

  return null;
};

export default AuthHandler;
