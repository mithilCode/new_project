import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_BASE_URL } from "../../utils/constant";
const initialState = {
  loading: false,
  reportData: [],
};
export const getReportList = createAsyncThunk("get-report-List", () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API_BASE_URL}/admin/getReportList`)
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

export const reportListSlice = createSlice({
  name: "reportList",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.authLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getReportList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getReportList.fulfilled, (state, action) => {
        state.loading = false;
        state.reportData = action.payload;
      })
      .addCase(getReportList.rejected, (state) => {
        state.loading = false;
        state.reportData = [];
      });
  },
});

export const { setLoading } = reportListSlice.actions;

export default reportListSlice.reducer;
