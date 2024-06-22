import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { saveToken } from "../../Helper/AuthTokenHelper";
import { API_BASE_URL } from "../../utils/constant";
import toast from 'react-hot-toast';
const initialState = {
  authLoading: false,
  isUserLogin: false,
};
export const loginAction = createAsyncThunk("auth/login", (dataProp)=> {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_BASE_URL}/admin/login`, dataProp)
      .then((res) => {
        if (res?.data?.data?.token) {
          resolve(res.data);
          saveToken(res?.data?.data?.token)
          toast.success(res?.data?.ResponseMsg)
        } else {
          reject({ message: res?.data?.msg });
          toast.error(res?.data?.ResponseMsg)
        }
      })
      .catch((error) => {
        toast.error(error?.message)
        reject(error);
      });
  });
});
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.authLoading = action.payload;
    },
    setIsLogin: (state, action) => {
      state.isUserLogin = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAction.pending, (state) => {
        state.isUserLogin = false;
        state.authLoading = true;
      })
      .addCase(loginAction.rejected, (state) => {
        state.isUserLogin = false;
        state.authLoading = false;
      })
      .addCase(loginAction.fulfilled, (state) => {
        state.isUserLogin = true;
        state.authLoading = false;
      });
  },
});

export const { setLoading,setIsLogin } = authSlice.actions;

export default authSlice.reducer;
