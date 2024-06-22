import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../../utils/constant";
import toast from "react-hot-toast";
const initialState = {
  plantData: [],
  plantDataLoading: false,
  updateData: {},
  isVerified: false,
  isPlantCreate: false,
  isPlantDelete: false,
  isPlantUpdate: false,
};
export const getPlantList = createAsyncThunk("get-plant-List", () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API_BASE_URL}/admin/plantList`)
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
export const pendingPlantList = createAsyncThunk("pending-Plant-List", () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API_BASE_URL}/admin/pendingPlantList`)
      .then((res) => {
        if (res?.data?.ResponseCode === 1 || res?.data?.ResponseCode === "1") {
          if (Object.keys(res?.data?.data).length > 0) {
            resolve(res.data?.data);
          } else {
            resolve({});
          }
        } else {
          reject({});
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
});
export const createPlant = createAsyncThunk("create-Plant", (dataProp) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_BASE_URL}/admin/createPlant`, dataProp)
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
export const updatePlant = createAsyncThunk("update-Plant", (dataProp) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_BASE_URL}/admin/updatePlant`, dataProp)
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
export const deletePlant = createAsyncThunk("delete-Farm", (dataProp) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_BASE_URL}/admin/deletePlant`, dataProp)
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
export const plantListSlice = createSlice({
  name: "plantList",
  initialState,
  reducers: {
    setPlantDataLoading: (state, action) => {
      state.plantDataLoading = action.payload;
    },
    setPlantData: (state, action) => {
      state.plantData = [action?.payload, ...state.plantData];
    },
    setUpDateData: (state, action) => {
      const { _id, ...rest } = action.payload;
      state.plantData = state.plantData.map((item) =>
        item._id === _id ? { ...item, ...rest } : item
      );
    },
    setPlantCreate: (state, action) => {
      state.authLoading = action.payload;
    },
    setPlantDelete: (state, action) => {
      const { userId, success } = action.payload;
      const updateData = state.plantData?.filter((item) => item?._id != userId);
      state.isPlantDelete = success;
      state.plantData = updateData;
    },
    setPlantUpdate: (state, action) => {
      state.authLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPlantList.pending, (state) => {
        state.plantDataLoading = true;
      })
      .addCase(getPlantList.fulfilled, (state, action) => {
        state.plantDataLoading = false;
        state.plantData = action.payload;
      })
      .addCase(getPlantList.rejected, (state) => {
        state.plantDataLoading = false;
        state.plantData = [];
      })
      .addCase(createPlant.pending, (state) => {
        state.plantDataLoading = true;
        state.isPlantCreate = false;
      })
      .addCase(createPlant.fulfilled, (state) => {
        state.plantDataLoading = false;
        state.isPlantCreate = true;
      })
      .addCase(createPlant.rejected, (state, action) => {
        state.plantDataLoading = false;
        state.isPlantCreate = action.payload;
      })
      .addCase(updatePlant.pending, (state) => {
        state.plantDataLoading = true;
        state.isPlantUpdate = false;
      })
      .addCase(updatePlant.fulfilled, (state) => {
        state.plantDataLoading = false;
        state.isPlantUpdate = true;
      })
      .addCase(updatePlant.rejected, (state) => {
        state.plantDataLoading = false;
        state.isPlantUpdate = false;
      })
      .addCase(deletePlant.pending, (state) => {
        state.plantDataLoading = true;
        state.isPlantDelete = false;
      })
      .addCase(deletePlant.fulfilled, (state) => {
        state.plantDataLoading = false;
        state.isPlantDelete = true;
      })
      .addCase(deletePlant.rejected, (state) => {
        state.plantDataLoading = false;
        state.isPlantDelete = false;
      });
  },
});

export const { setPlantDataLoading, setPlantData, setPlantDelete, setUpDateData } =
  plantListSlice.actions;

export default plantListSlice.reducer;
