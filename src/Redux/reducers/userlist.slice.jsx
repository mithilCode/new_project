import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../../utils/constant";
import toast from "react-hot-toast";
const initialState = {
  userDataLoading: false,
  userData: [],
  isVerified: false,
  isuserDelete: false,
};
export const getUserList = createAsyncThunk("get-User-List", () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API_BASE_URL}/admin/userList`)
      .then((res) => {
        if (res?.data?.ResponseCode === 1 || res?.data?.ResponseCode === "1") {
          if (Object.keys(res?.data?.data).length > 0) {
            resolve(res.data?.data);
          } else {
            resolve([]);
          }
        } else {
          reject([]);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
});
export const approveAction = createAsyncThunk(
  "registrationStatus",
  (dataProp) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${API_BASE_URL}/admin/registrationStatus`, dataProp)
        .then((res) => {
          if (
            res?.data?.ResponseCode === 1 ||
            res?.data?.ResponseCode === "1"
          ) {
            resolve(res?.data?.data);
          } else {
            reject({ message: res?.data?.msg });
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
);
export const removeUser = createAsyncThunk("deleteUser", (dataProp) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_BASE_URL}/admin/deleteUser`, dataProp)
      .then((res) => {
        if (res?.data?.ResponseCode === 1 || res?.data?.ResponseCode === "1") {
          resolve(res?.data?.data);
          toast.success(res?.data?.ResponseMsg);
        } else {
          reject({ message: res?.data?.msg });
          toast.error(res?.data?.ResponseMsg);
        }
      })
      .catch((error) => {
        reject(error);
        toast.error(error?.message);
      });
  });
});
export const deliveryDateEdit = createAsyncThunk("deliveryDateEdit", (dataProp) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_BASE_URL}/admin/deliveryDateEdit`, dataProp)
      .then((res) => {
        if (res?.data?.ResponseCode === 1 || res?.data?.ResponseCode === "1") {
          resolve(res?.data?.data);
          toast.success(res?.data?.ResponseMsg);
        } else {
          reject({ message: res?.data?.msg });
          toast.error(res?.data?.ResponseMsg);
        }
      })
      .catch((error) => {
        reject(error);
        toast.error(error?.message);
      });
  });
});
export const userSlice = createSlice({
  name: "userList",
  initialState,
  reducers: {
    setUserDataLoading: (state, action) => {
      state.userDataLoading = action.payload;
    },
    setIsVerified: (state, action) => {
      state.isVerified = action.payload;
    },
    setIsuserDelete: (state, action) => {
      const { status, id } = action.payload;
      state.isuserDelete = status;
      const updateData = state.userData?.filter((item) => item?._id != id);
      state.userData = updateData;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserList.pending, (state) => {
        state.userDataLoading = true;
      })
      .addCase(getUserList.fulfilled, (state, action) => {
        state.userDataLoading = false;
        state.userData = action.payload;
      })
      .addCase(getUserList.rejected, (state) => {
        state.userDataLoading = false;
        state.userData = [];
      })
      .addCase(approveAction.pending, (state) => {
        state.userDataLoading = true;
      })
      .addCase(approveAction.fulfilled, (state) => {
        state.userDataLoading = false;
        state.isVerified = true;
      })
      .addCase(approveAction.rejected, (state) => {
        state.userDataLoading = false;
        state.isVerified = false;
      })
      .addCase(removeUser.pending, (state) => {
        state.userDataLoading = true;
        state.isuserDelete = false;
      })
      .addCase(removeUser.fulfilled, (state) => {
        state.userDataLoading = false;
        state.isuserDelete = true;
      })
      .addCase(removeUser.rejected, (state) => {
        state.userDataLoading = false;
        state.isuserDelete = false;
      });
  },
});

export const { setUserDataLoading, setIsVerified, setIsuserDelete } = userSlice.actions;

export default userSlice.reducer;
