import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../../utils/constant";
import toast from "react-hot-toast";

const initialState = {
  loading: false,
  assignPlantListData: [],
  assignFarmData: [],
  farmDetailData: [],
};
export const assignPlantList = createAsyncThunk("assignPlantList", () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API_BASE_URL}/admin/assignPlantList`)
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
        toast.error(error?.message);
        reject(error);
      });
  });
});
export const assignFarmList = createAsyncThunk("assignFarmList", (dataProp) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_BASE_URL}/admin/assignFarmList`, dataProp)
      .then((res) => {
        if (res?.data?.ResponseCode === 1 || res?.data?.ResponseCode === "1") {
          resolve(res?.data?.data);
        } else {
          reject({ message: res?.data?.ResponseMsg });
          toast.error(res?.data?.ResponseMsg);
        }
      })
      .catch((error) => {
        reject(error);
        toast.error(error?.message);
      });
  });
});
export const farmDetail = createAsyncThunk("farmDetail", (dataProp) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_BASE_URL}/admin/farmDetail`, dataProp)
      .then((res) => {
        if (res?.data?.ResponseCode === 1 || res?.data?.ResponseCode === "1") {
          resolve(res?.data?.data);
        } else {
          reject({ message: res?.data?.ResponseMsg });
          toast.error(res?.data?.ResponseMsg);
        }
      })
      .catch((error) => {
        reject(error);
        toast.error(error?.message);
      });
  });
});
export const assignPlantToUser = createAsyncThunk("assignPlantToUser", (dataProp) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_BASE_URL}/admin/assignPlantToUser`, dataProp)
      .then((res) => {
        if (res?.data?.ResponseCode === 1 || res?.data?.ResponseCode === "1") {
          resolve(res?.data?.data);
          toast.success(res?.data?.ResponseMsg);
        } else {
          reject({ message: res?.data?.ResponseMsg });
          toast.error(res?.data?.ResponseMsg);
        }
      })
      .catch((error) => {
        reject(error);
        toast.error(error?.message);
      });
  });
});

export const assignPlantSlice = createSlice({
  name: "assignPlant",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.authLoading = action.payload;
    },
    setAssignFarmData: (state, action) => {
      state.assignFarmData = action.payload;
    },
    setFarmDetailData: (state, action) => {
      state.farmDetailData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(assignPlantList.pending, (state) => {
        state.loading = true;
      })
      .addCase(assignPlantList.fulfilled, (state, action) => {
        state.loading = false;
        state.assignPlantListData = action.payload;
      })
      .addCase(assignPlantList.rejected, (state) => {
        state.loading = false;
        state.plantData = [];
      })
      .addCase(assignFarmList.pending, (state) => {
        state.loading = true;
      })
      .addCase(assignFarmList.fulfilled, (state, action) => {
        state.loading = false;
        state.assignFarmData = action.payload;
      })
      .addCase(assignFarmList.rejected, (state) => {
        state.loading = false;
        state.plantData = [];
      })
      .addCase(farmDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(farmDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.farmDetailData = action.payload;
      })
      .addCase(farmDetail.rejected, (state) => {
        state.loading = false;
        state.farmDetailData = [];
      });
  },
});

export const { setLoading, setAssignFarmData, setFarmDetailData } =
  assignPlantSlice.actions;

export default assignPlantSlice.reducer;
