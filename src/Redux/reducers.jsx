import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth.slice";
import userlistSlice from "./reducers/userlist.slice";
import farmListSlice from "./reducers/farm.slice";
import plantListSlice from "./reducers/plant.slice";
import reportListSlice from "./reducers/report.slice";
import assignPlantSlice from "./reducers/assignPlant";
import { logout } from "./action";

const appReducer = combineReducers({
  auth: authSlice,
  userList: userlistSlice,
  farmList: farmListSlice,
  plantList: plantListSlice,
  reportList: reportListSlice,
  assignPlant: assignPlantSlice,
});

const rootReducer = (state, action) => {
  if (action.type === logout.type) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
