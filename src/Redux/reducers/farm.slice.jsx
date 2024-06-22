import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../../utils/constant";
import toast from "react-hot-toast";

const initialState = {
  farmData: [],
  loading: false,
  updateData: {},
  isFarmCreate: false,
  isFarmDelete: false,
  isFarmUpdate: false,
  isFarmAssign: false,
};
export const getFarmList = createAsyncThunk("get-farm-List", () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API_BASE_URL}/admin/farmList`)
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
export const assignFarmToUser = createAsyncThunk(
  "assign-FarmToUser",
  (dataProp) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${API_BASE_URL}/admin/assignFarmToUser`, dataProp)
        .then((res) => {
          if (
            res?.data?.ResponseCode === 1 ||
            res?.data?.ResponseCode === "1"
          ) {
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
  }
);
export const createFarm = createAsyncThunk("create-Farm", (dataProp) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_BASE_URL}/admin/createFarm`, dataProp)
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
export const updateFarm = createAsyncThunk("update-Farm", (dataProp) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_BASE_URL}/admin/updateFarm`, dataProp)
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
export const deleteFarm = createAsyncThunk("delete-Farm", (dataProp) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_BASE_URL}/admin/deleteFarm`, dataProp)
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
export const farmListSlice = createSlice({
  name: "farmList",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.authLoading = action.payload;
    },
    setFarmData: (state, action) => {
      state.farmData = [action?.payload, ...state.farmData];
    },
    setUpDateData: (state, action) => {
      const { _id, ...rest } = action.payload;
      state.farmData = state.farmData.map((item) =>
        item._id === _id ? { ...item, ...rest } : item
      );
    },
    setFarmCreate: (state, action) => {
      state.isFarmCreate = action.payload;
    },
    setFarmDelete: (state, action) => {
      const { userId, success } = action.payload;
      const updateData = state.farmData?.filter((item) => item?._id != userId);
      state.isFarmDelete = success;
      state.farmData = updateData;
    },
    setFarmUpdate: (state, action) => {
      state.isFarmUpdate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFarmList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFarmList.fulfilled, (state, action) => {
        state.loading = false;
        state.farmData = action?.payload;
      })
      .addCase(getFarmList.rejected, (state) => {
        state.loading = false;
        state.farmData = [];
      })
      .addCase(createFarm.pending, (state) => {
        state.loading = true;
        state.isFarmCreate = false;
      })
      .addCase(createFarm.fulfilled, (state) => {
        state.loading = false;
        state.isFarmCreate = true;
      })
      .addCase(createFarm.rejected, (state) => {
        state.loading = false;
        state.isFarmCreate = false;
      })
      .addCase(updateFarm.pending, (state) => {
        state.loading = true;
        state.isFarmUpdate = false;
      })
      .addCase(updateFarm.fulfilled, (state) => {
        state.loading = false;
        state.isFarmUpdate = true;
      })
      .addCase(updateFarm.rejected, (state) => {
        state.loading = false;
        state.isFarmUpdate = false;
      })
      .addCase(deleteFarm.pending, (state) => {
        state.loading = true;
        state.isFarmDelete = false;
      })
      .addCase(deleteFarm.fulfilled, (state) => {
        state.loading = false;
        state.isFarmDelete = true;
      })
      .addCase(deleteFarm.rejected, (state) => {
        state.loading = false;
        state.isFarmDelete = false;
      })
      .addCase(assignFarmToUser.pending, (state) => {
        state.loading = true;
        state.isFarmAssign = false;
      })
      .addCase(assignFarmToUser.fulfilled, (state) => {
        state.loading = false;
        state.isFarmAssign = true;
      })
      .addCase(assignFarmToUser.rejected, (state) => {
        state.loading = false;
        state.isFarmAssign = false;
      });
  },
});

export const {
  setLoading,
  setFarmData,
  setFarmDelete,
  setFarmCreate,
  setUpDateData,
} = farmListSlice.actions;

export default farmListSlice.reducer;
